from http.client import HTTPResponse
import json
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from log.models import LogEntry
from .models import Prescription, GlassPrescription, ContactLensPrescription, LensDetails, Customer, JobCard, Appointment
from django.core.exceptions import ObjectDoesNotExist
from django.forms.models import model_to_dict
from django.utils.dateparse import parse_date, parse_datetime
from django.utils.timezone import make_aware
from datetime import datetime, date
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A5
from reportlab.lib.pagesizes import landscape

today_date = date.today()
today_date_str = datetime.strftime(today_date, "%Y-%m-%d")

def not_found_view(request):
    return render(request, 'notfound.html', status=404)

@login_required(login_url='/accounts/login/')
def dashboard_render (request):
	"""
	Render function for Dashboard Index page
	"""
	# fullname = request.user.get_full_name()
	return render(request, 'dashboard/index.html', {"fullname": "Pleo"})

#@login_required(login_url='/accounts/login/')
@require_http_methods(["POST"])
def add_customer(request):    
    try:
        data = json.loads(request.body)
        
        existing_customer = Customer.objects.filter(
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            nic_number=data.get('nic_number')
        ).first()

        if existing_customer:
            LogEntry.objects.create(
                user=request.user,
                action=LogEntry.ERROR,
                description=f"Attempted to created Customer {data.get('first_name')} {data.get('last_name')} but a duplicate was found."
            )
            
            return JsonResponse({"message": "Duplicate customer found."}, status=400)
        
        

        customer = Customer(
            title=data.get('title'),
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            date_of_birth=data.get('date_of_birth'),
            mobile_1=data.get('mobile_1'),
            mobile_2=data.get('mobile_2', ''),
            address=data.get('address'),
            city=data.get('city'),
            email=data.get('email'),
            nic_number=data.get('nic_number', ''),
            profession=data.get('profession', ''),
            insurance=data.get('insurance'),
            created_date=today_date_str,
            last_modified_date=today_date_str
        )
        
        customer.save()
        
        LogEntry.objects.create(
            user=request.user,
            action=LogEntry.CREATED,
            description=f"Customer {customer.first_name} {customer.last_name} created."
        )

        return JsonResponse({"message": "Customer added successfully."}, status=201)

    except Exception as e:
        return JsonResponse({"message": str(e)}, status=400)

#@login_required(login_url='/accounts/login/')
def get_all_customers(request):
	entries = (
		Customer.objects.values("id", "title", "first_name", "last_name", "mobile_1", "city", "nic_number")
	)
	return JsonResponse({"values": list(entries)})

#@login_required(login_url='/accounts/login/')
def get_customer(request, customer_id):
	customer = Customer.objects.get(id=customer_id)
	return JsonResponse({"values": customer.to_dict()})

@login_required(login_url='/accounts/login/')
@require_http_methods(["PUT"])
def update_customer(request, customer_id):
    try:
        data = json.loads(request.body)
        customer = Customer.objects.get(id=customer_id)
    
        customer.title=data.get('title', customer.title)
        customer.first_name=data.get('first_name', customer.first_name)
        customer.last_name=data.get('last_name', customer.last_name)
        customer.date_of_birth=data.get('date_of_birth', customer.date_of_birth)
        customer.mobile_1=data.get('mobile_1', customer.mobile_1)
        customer.mobile_2=data.get('mobile_2', customer.mobile_2)
        customer.address=data.get('address', customer.address)
        customer.city=data.get('city', customer.city)
        customer.email=data.get('email', customer.email)
        customer.nic_number=data.get('nic_number', customer.nic_number)
        customer.profession=data.get('profession', customer.profession)
        customer.insurance=data.get('insurance', customer.insurance)
        customer.last_modified_date=today_date_str

        customer.save()
        
        LogEntry.objects.create(
                user=request.user,
                action=LogEntry.UPDATED,
                description=f"Customer {customer.first_name} {customer.last_name} updated."
            )
        
        return JsonResponse({'message': 'Customer updated successfully'}, status=200)
    except Customer.DoesNotExist:
        LogEntry.objects.create(
                user=request.user,
                action=LogEntry.ERROR,
                description=f"Customer {customer.first_name} {customer.last_name} update failed. Customer does not exist."
            )
        return JsonResponse({'message': 'Customer not found'}, status=404)
    except Exception as e:
        LogEntry.objects.create(
                user=request.user,
                action=LogEntry.ERROR,
                description=f"Customer {customer.first_name} {customer.last_name} update failed. {e}"
            )
        return JsonResponse({'message': str(e)}, status=500)
    
@require_http_methods(["POST"])
def create_prescription(request):
    try:
        data = json.loads(request.body)
        
        customer = Customer.objects.filter(id=data['customer']).first()

        prescription = Prescription.objects.create(
            customer_id=data['customer'],
            doctor_id=data['doctor'],
            last_eye_test=data.get('last-eye-test', ''),
            next_checkup=datetime.strptime(data['next-checkup-date'], '%Y-%m-%d').date() if data['next-checkup-date'] else None,
            care_system=data.get('care-system', ''),
            recommendation=data.get('recommendation', ''),
            vision=data.get('vision', ''),
            created_date=today_date_str,
            last_modified_date=today_date_str            
        )

        glass_lens_detail_right = LensDetails.objects.create(
            side='Right',
            sph=data.get('glass-right-sph'),
            cyl=data.get('glass-right-cyl'),
            axis=data.get('glass-right-axis')
        )
        
        glass_lens_detail_left = LensDetails.objects.create(
            side='Left',
            sph=data.get('glass-left-sph'),
            cyl=data.get('glass-left-cyl'),
            axis=data.get('glass-left-axis')
        )

        GlassPrescription.objects.create(
            prescription=prescription,
            lens_detail_right=glass_lens_detail_right,
            lens_detail_left=glass_lens_detail_left,
            type_of_lenses=data.get('type-of-lenses', ''),
            pdr=data.get('pdr'),
            pdl=data.get('pdl')
        )

        contact_lens_detail_right = LensDetails.objects.create(
            side='Right',
            sph=data.get('lens-right-sph'),
            cyl=data.get('lens-right-cyl'),
            axis=data.get('lens-right-axis')
        )
        
        contact_lens_detail_left = LensDetails.objects.create(
            side='Left',
            sph=data.get('lens-left-sph'),
            cyl=data.get('lens-left-cyl'),
            axis=data.get('lens-left-axis')
        )

        ContactLensPrescription.objects.create(
            prescription=prescription,
            lens_detail_right=contact_lens_detail_right,
            lens_detail_left=contact_lens_detail_left,
        )

        LogEntry.objects.create(
            user=request.user,
            action='CREATED',
            description=f"Prescription for Customer {customer.first_name} {customer.last_name} created successfully."
        )

        return JsonResponse({'message': 'Prescription created successfully', 'id': prescription.id}, status=201)
    
    except Exception as e:
        
        LogEntry.objects.create(
            user=request.user,
            action='ERROR',
            description=f"Error creating Prescription for Customer {customer.first_name} {customer.last_name}. Error: {e}"
        )
        
        return JsonResponse({'error': str(e)}, status=400)

    
def get_all_prescriptions(request):
	entries = (
		Prescription.objects.select_related("")
            .values("id", "doctor__first_name", "doctor__last_name", "customer__first_name", "customer__last_name", "created_date")
	)
	return JsonResponse({"values": list(entries)})

def get_prescription(request, prescription_id):
    try:
        prescription = Prescription.objects.get(id=prescription_id)

        prescription_dict = model_to_dict(prescription, exclude=["doctor", "customer"])
        prescription_dict['doctor_name'] = f"{prescription.doctor.first_name} {prescription.doctor.last_name}"
        prescription_dict['customer_name'] = f"{prescription.customer.first_name} {prescription.customer.last_name}"

        # Initialize the response dictionary with the Prescription data
        response = {"prescription": prescription_dict}

        try:
            glass_prescription = prescription.glass_prescription
            response['glass_prescription'] = {
                "lens_detail_right": model_to_dict(glass_prescription.lens_detail_right),
                "lens_detail_left": model_to_dict(glass_prescription.lens_detail_left),
                "type_of_lenses": glass_prescription.type_of_lenses,
                "pdr": glass_prescription.pdr,
                "pdl": glass_prescription.pdl,
            }
        except ObjectDoesNotExist:
            response['glass_prescription'] = None

        try:
            contact_lens_prescription = prescription.contact_lens_prescription
            response['contact_lens_prescription'] = {
                "lens_detail_right": model_to_dict(contact_lens_prescription.lens_detail_right),
                "lens_detail_left": model_to_dict(contact_lens_prescription.lens_detail_left),
            }
        except ObjectDoesNotExist:
            response['contact_lens_prescription'] = None

        return JsonResponse(response)

    except Prescription.DoesNotExist:
        return JsonResponse({"error": "Prescription not found"}, status=404)
    
@require_http_methods(["POST"])
def create_job_card(request):
    try:
        data = json.loads(request.body)
        
        customer = data.get('customer')
        type_of_job_card = data.get('typeOfJobCard')
        salesman = data.get('salesman')
        status = data.get('status')
        supplier = data.get('supplier')
        supplier_reference = data.get('supplierReference')
        estimated_delivery_date = data.get('estimatedDeliveryDate')
        if estimated_delivery_date:
            estimated_delivery_date = datetime.strptime(estimated_delivery_date, '%Y-%m-%d').date()

        job_card_fields = {
            'customer_id': customer,
            'job_type': type_of_job_card,
            'salesman': salesman,
            'status': status,
            'supplier': supplier,
            'supplier_reference': supplier_reference,
            'estimated_delivery_date': estimated_delivery_date,
        }

        if type_of_job_card == 'lenses':
            job_card_fields.update({
                'frame': data.get('frame'),
                'ht': data.get('ht'),
                'lens': data.get('lens'),
            })

        elif type_of_job_card == 'contactLenses':
            job_card_fields.update({
                'base_curve': data.get('baseCurve'),
                'diameter': data.get('diameter'),
                'no_of_boxes': data.get('noOfBoxes'),
                'contact_lens': data.get('contactLens'),
            })

        print(job_card_fields)
        job_card = JobCard.objects.create(**job_card_fields)

        LogEntry.objects.create(
            user=request.user,
            action='CREATED',
            description=f"Job Card {job_card.id} of type {type_of_job_card} created successfully."
        )

        return JsonResponse({'message': 'Job Card created successfully', 'id': job_card.id}, status=201)
    
    except Exception as e:
        # Log the error
        LogEntry.objects.create(
            user=request.user,
            action='ERROR',
            description=f"Error creating Job Card. Error: {e}"
        )
        
        return JsonResponse({'error': str(e)}, status=400)
    
def get_all_job_cards(request):
	entries = JobCard.objects.select_related('customer').values(
        *{f.name for f in JobCard._meta.get_fields() if not f.is_relation or f.one_to_one or (f.many_to_one and f.related_model)},
        'customer__first_name',
        'customer__last_name',
    )
	return JsonResponse({"values": list(entries)})

def get_job_card(request, job_card_id):
    job_card = JobCard.objects.get(id=job_card_id)
    return JsonResponse({"values": job_card.to_dict()})

@require_http_methods(["POST"])
def create_appointment(request):
    try:
        data = json.loads(request.body)

        # Parse the datetime string to a datetime object
        appointment_datetime = parse_datetime(data['appointmentDate'])

        # If the appointment_datetime is None, the string is not properly formatted.
        if not appointment_datetime:
            raise ValueError("Incorrect date format for 'appointmentDate'")

        # Extract the date component for the appointment_date
        appointment_date = appointment_datetime.date()

        # Parse the datetime fields for start and end times
        start_time = parse_datetime(data['startTime']).time() if parse_datetime(data['startTime']) else None
        end_time = parse_datetime(data['endTime']).time() if parse_datetime(data['endTime']) else None

        # Convert noOfPatients to an integer
        no_of_patients = int(data['noOfPatients'])

        # Create the Appointment object
        appointment = Appointment.objects.create(
            customer_id=data['customer'],
            appointment_date=appointment_date,
            start_time=start_time,  # Extracting time from datetime
            end_time=end_time,  # Extracting time from datetime
            status=data['status'],
            doctor_id=data['doctor'],
            number_of_patients=no_of_patients,
            description=data['description']
        )

        # Log the successful creation
        LogEntry.objects.create(
            user=request.user,
            action='CREATED',
            description=f"Appointment for Customer ID {data['customer']} created successfully."
        )

        return JsonResponse({'message': 'Appointment created successfully', 'id': appointment.id}, status=201)
    
    except Exception as e:
        # Log the error
        LogEntry.objects.create(
            user=request.user,
            action='ERROR',
            description=f"Error creating Appointment. Error: {e}"
        )
        
        return JsonResponse({'error': str(e)}, status=400)
    
def get_all_appointments(request):
	entries = Appointment.objects.select_related('customer').values(
        *{f.name for f in Appointment._meta.get_fields() if not f.is_relation or f.one_to_one or (f.many_to_one and f.related_model)},
        'customer__first_name',
        'customer__last_name',
    )
	return JsonResponse({"values": list(entries)})

def get_appointment(request, appointment_id):
    appointment = Appointment.objects.get(id=appointment_id)
    return JsonResponse({"values": appointment.to_dict()})

@require_http_methods(["PUT"])
def update_appointment(request, appointment_id):
    try:
        data = json.loads(request.body)
        appointment = Appointment.objects.get(id=appointment_id)
        
        # Parse the datetime string to a datetime object
        appointment_date = parse_datetime(data.get('appointmentDate'))
        if appointment_date:
            appointment.appointment_date = appointment_date.date()

        start_time = parse_datetime(data.get('startTime'))
        if start_time:
            appointment.start_time = start_time.time()

        end_time = parse_datetime(data.get('endTime'))
        if end_time:
            appointment.end_time = end_time.time()

        # Update the fields if new values are provided, else keep the old values
        appointment.status = data.get('status', appointment.status)
        appointment.description = data.get('description', appointment.description)
        appointment.customer_id = data.get('customer', appointment.customer_id)
        appointment.doctor_id = data.get('doctor', appointment.doctor_id)
        appointment.number_of_patients = int(data.get('noOfPatients', appointment.number_of_patients))
        
        # Assuming today_date_str is a string representation of today's date
        appointment.last_modified_date = datetime.today().strftime('%Y-%m-%d')

        appointment.save()

        # Log the successful update
        LogEntry.objects.create(
            user=request.user,
            action=LogEntry.UPDATED,
            description=f"Appointment ID {appointment.id} updated successfully."
        )

        return JsonResponse({'message': 'Appointment updated successfully'}, status=200)

    except Appointment.DoesNotExist:
        LogEntry.objects.create(
            user=request.user,
            action=LogEntry.ERROR,
            description=f"Appointment update failed. Appointment ID {appointment_id} does not exist."
        )
        return JsonResponse({'message': 'Appointment not found'}, status=404)
    except Exception as e:
        LogEntry.objects.create(
            user=request.user,
            action=LogEntry.ERROR,
            description=f"Error updating Appointment ID {appointment_id}. Error: {e}"
        )
        return JsonResponse({'message': str(e)}, status=500)
    
def generate_prescription_pdf(request):
    try:
        # Parse the form data from the POST request
        form_data = json.loads(request.body)
        print(form_data)
        # Create an HTTP response with PDF headers
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="prescription.pdf"'

        # Set up the ReportLab PDF canvas in landscape A5
        c = canvas.Canvas(response, pagesize=landscape(A5))
        width, height = landscape(A5)

        # Define the positions for the elements
        left_margin = 20
        top_margin = height - 40  # Adjusted to align with the first item of patient information

        # Title
        c.setFont("Helvetica-Bold", 16)
        c.drawString(left_margin, height - 20, "KLER VISION")

        # Patient Information and Prescription Grid
        c.setFont("Helvetica", 12)
        patient_info_start_height = top_margin
        grid_left_column = 280  # This is the X position where your grid starts

        # Patient information
        c.drawString(left_margin, patient_info_start_height, "Name:")
        c.drawString(left_margin, patient_info_start_height - 20, "Surname:")
        c.drawString(left_margin, patient_info_start_height - 40, "Care:")
        c.drawString(left_margin, patient_info_start_height - 60, "Next:")

        # Prescription Grid aligned with patient information
        c.drawString(grid_left_column, patient_info_start_height, "SPHERE")
        c.drawString(grid_left_column + 70, patient_info_start_height, "CYLINDER")
        c.drawString(grid_left_column + 140, patient_info_start_height, "AXIS")

        # Drawing the grid lines
        grid_height = patient_info_start_height - 15  # Starting just below the headers
        c.grid([grid_left_column, grid_left_column + 70, grid_left_column + 140, width - left_margin],
               [grid_height, grid_height - 20, grid_height - 40])

        # Fill in the 'glass-right-cyl' data into the grid
        c.drawString(grid_left_column + 70, grid_height - 20, str(form_data.get('glass-right-cyl', '')))

        # Footer
        footer_height = 20
        c.setFont("Helvetica-Oblique", 10)
        c.drawString(left_margin, footer_height, "Optical Zone Ltd - Valentina Mall")

        # Finalize PDF
        c.showPage()
        c.save()
        # Return the response
        return response
    except json.JSONDecodeError:
        return JsonResponse({'message': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)