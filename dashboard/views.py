from http.client import HTTPResponse
import json
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from log.models import LogEntry
from .models import Prescription, GlassPrescription, ContactLensPrescription, LensDetails, Customer, JobCard, Appointment, Invoice, InvoiceLineItem
from django.core.exceptions import ObjectDoesNotExist
from django.forms.models import model_to_dict
from django.utils.dateparse import parse_date, parse_datetime
from django.utils.timezone import make_aware
from datetime import datetime, date
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A5
from reportlab.lib.pagesizes import landscape
from django.utils.dateparse import parse_datetime
from django.utils import timezone
from .models import Product, Category, Supplier, Location
import base64
from django.core.files.base import ContentFile

today_date = date.today()
today_date_str = datetime.strftime(today_date, "%Y-%m-%d")

def not_found_view(request):
    return render(request, 'notfound.html', status=404)

def format_with_plus_if_positive(value):
    try:
        # Convert the value to a float and check if it's positive
        if float(value) > 0:
            return f"+{value}"
    except ValueError:
        # If value is not a number, return it as is
        pass

    return value

@login_required(login_url='/accounts/login/')
def dashboard_render (request):
	"""
	Render function for Dashboard Index page
	"""
	# fullname = request.user.get_full_name()
	return render(request, 'dashboard/index.html', {"fullname": "Pleo"})

#@login_required(login_url='/accounts/login/')
@require_http_methods(["POST"])
def create_customer(request):    
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
        
        print(data)
        
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
        print(data)    
        customer.title=data.get('title', customer.title)
        customer.first_name=data.get('first_name', customer.first_name)
        customer.last_name=data.get('last_name', customer.last_name)
        customer.date_of_birth=data.get('date_of_birth')
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
        print(data)
        prescription = Prescription.objects.create(
            customer_id=data['customer'],
            doctor_id=data['doctor'],
            last_eye_test=data.get('last-eye-test', ''),
            next_checkup=datetime.strptime(data.get('next-checkup-date'), '%Y-%m-%d').date() if data.get('next-checkup-date') else None,
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
            glass_add=data.get('glass-add', ''),
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
            type_of_contact_lenses=data.get('type-of-contact-lenses', ''),
            contact_lens_add=data.get('contact-lens-add', ''),
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
    
@require_http_methods(["PUT"])
def update_prescription(request, prescription_id):
    try:
        data = json.loads(request.body)
        print(data)
        prescription = Prescription.objects.get(id=prescription_id)

        prescription.last_eye_test = data.get('last-eye-test', prescription.last_eye_test)
        prescription.care_system = data.get('care-system', prescription.care_system)
        prescription.recommendation = data.get('recommendation', prescription.recommendation)
        if data.get('next-checkup'):
            prescription.next_checkup = datetime.strptime(data['next-checkup'], '%Y-%m-%d').date()
        prescription.vision = data.get('vision', prescription.vision)
        prescription.last_modified_date = datetime.now().date() # Adjust as per your requirements
        prescription.save()
         # Update GlassPrescription
        glass_prescription = prescription.glass_prescription
        glass_prescription.lens_detail_right.sph = data.get('glass-right-sph', glass_prescription.lens_detail_right.sph)
        glass_prescription.lens_detail_right.cyl = data.get('glass-right-cyl', glass_prescription.lens_detail_right.cyl)
        glass_prescription.lens_detail_right.axis = data.get('glass-right-axis', glass_prescription.lens_detail_right.axis)
        glass_prescription.lens_detail_right.save()

        glass_prescription.lens_detail_left.sph = data.get('glass-left-sph', glass_prescription.lens_detail_left.sph)
        glass_prescription.lens_detail_left.cyl = data.get('glass-left-cyl', glass_prescription.lens_detail_left.cyl)
        glass_prescription.lens_detail_left.axis = data.get('glass-left-axis', glass_prescription.lens_detail_left.axis)
        glass_prescription.lens_detail_left.save()

        glass_prescription.type_of_lenses = data.get('type-of-lenses', glass_prescription.type_of_lenses)
        glass_prescription.pdr = data.get('pdr', glass_prescription.pdr)
        glass_prescription.pdl = data.get('pdl', glass_prescription.pdl)
        glass_prescription.glass_add = data.get('glass-add', glass_prescription.glass_add)
        glass_prescription.save()

        # Update ContactLensPrescription
        contact_lens_prescription = prescription.contact_lens_prescription
        contact_lens_prescription.lens_detail_right.sph = data.get('lens-right-sph', contact_lens_prescription.lens_detail_right.sph)
        contact_lens_prescription.lens_detail_right.cyl = data.get('lens-right-cyl', contact_lens_prescription.lens_detail_right.cyl)
        contact_lens_prescription.lens_detail_right.axis = data.get('lens-right-axis', contact_lens_prescription.lens_detail_right.axis)
        contact_lens_prescription.lens_detail_right.save()

        contact_lens_prescription.lens_detail_left.sph = data.get('lens-left-sph', contact_lens_prescription.lens_detail_left.sph)
        contact_lens_prescription.lens_detail_left.cyl = data.get('lens-left-cyl', contact_lens_prescription.lens_detail_left.cyl)
        contact_lens_prescription.lens_detail_left.axis = data.get('lens-left-axis', contact_lens_prescription.lens_detail_left.axis)
        contact_lens_prescription.lens_detail_left.save()

        contact_lens_prescription.type_of_contact_lenses = data.get('type-of-contact-lenses', contact_lens_prescription.type_of_contact_lenses)
        contact_lens_prescription.contact_lens_add = data.get('contact-lens-add', contact_lens_prescription.contact_lens_add)
        contact_lens_prescription.save()
        # Log the update
        LogEntry.objects.create(
            user=request.user,
            action=LogEntry.UPDATED,
            description=f"Prescription {prescription.id} updated successfully."
        )

        return JsonResponse({'message': 'Prescription updated successfully'}, status=200)

    except Prescription.DoesNotExist:
        LogEntry.objects.create(
            user=request.user,
            action=LogEntry.ERROR,
            description="Update failed. Prescription does not exist."
        )
        return JsonResponse({'message': 'Prescription not found'}, status=404)
    except Exception as e:
        LogEntry.objects.create(
            user=request.user,
            action=LogEntry.ERROR,
            description=f"Error updating Prescription. Error: {e}")
        return JsonResponse({'error': str(e)}, status=500)

    
def get_all_prescriptions(request):
	entries = (
		Prescription.objects.select_related("")
            .values("id", "doctor__first_name", "doctor__last_name", "customer__first_name", "customer__last_name", "created_date").order_by("-id","-created_date")
	)
	return JsonResponse({"values": list(entries)})

def get_prescription(request, prescription_id):
    try:
        prescription = Prescription.objects.get(id=prescription_id)

        prescription_dict = model_to_dict(prescription, exclude=["doctor", "customer"])
        prescription_dict['doctor_name'] = f"{prescription.doctor.first_name} {prescription.doctor.last_name}"
        prescription_dict['customer_name'] = f"{prescription.customer.first_name} {prescription.customer.last_name}"
        prescription_dict['customer_id'] = prescription.customer.id
        

        # Initialize the response dictionary with the Prescription data
        response = {"prescription": prescription_dict}

        try:
            glass_prescription = prescription.glass_prescription
            print(glass_prescription.pdr)
            response['glass_prescription'] = {
                "lens_detail_right": model_to_dict(glass_prescription.lens_detail_right),
                "lens_detail_left": model_to_dict(glass_prescription.lens_detail_left),
                "type_of_lenses": glass_prescription.type_of_lenses,
                "pdr": glass_prescription.pdr,
                "pdl": glass_prescription.pdl,
                "glass_add": glass_prescription.glass_add
            }
        except ObjectDoesNotExist:
            response['glass_prescription'] = None

        try:
            contact_lens_prescription = prescription.contact_lens_prescription
            response['contact_lens_prescription'] = {
                "type_of_contact_lenses": contact_lens_prescription.type_of_contact_lenses,
                "lens_detail_right": model_to_dict(contact_lens_prescription.lens_detail_right),
                "lens_detail_left": model_to_dict(contact_lens_prescription.lens_detail_left),
                "contact_lens_add" : contact_lens_prescription.contact_lens_add
            }
        except ObjectDoesNotExist:
            response['contact_lens_prescription'] = None
        return JsonResponse(response)

    except Prescription.DoesNotExist:
        return JsonResponse({"error": "Prescription not found"}, status=404)
    
def get_prescriptions_by_customer(request, customer_id):
    try:
        prescriptions = Prescription.objects.filter(customer__id=customer_id)
        
        prescriptions_list = []
        for prescription in prescriptions:
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
                    "type_of_contact_lenses": contact_lens_prescription.type_of_contact_lenses,
                    "lens_detail_right": model_to_dict(contact_lens_prescription.lens_detail_right),
                    "lens_detail_left": model_to_dict(contact_lens_prescription.lens_detail_left),
                }
            except ObjectDoesNotExist:
                response['contact_lens_prescription'] = None
                
            prescriptions_list.append(response)

        return JsonResponse(prescriptions_list, safe=False)

    except Prescription.DoesNotExist:
        return JsonResponse({"error": "Prescription not found"}, status=404)
    
@require_http_methods(["POST"])
def create_job_card(request):
    try:
        data = json.loads(request.body)
        
        print(data)
        
        prescription_id = data.get('prescription_id')
        customer = data.get('customer')
        type_of_job_card = data.get('typeOfJobCard')
        salesman = data.get('salesman')
        status = data.get('status')
        supplier = data.get('supplier')
        supplier_reference = data.get('supplierReference')
        estimated_delivery_date = data.get('estimatedDeliveryDate')
        #if estimated_delivery_date:
            #estimated_delivery_date = datetime.strptime(estimated_delivery_date, '%Y-%m-%d').date()

        job_card_fields = {
            'prescription_id': prescription_id,
            'customer_id': customer,
            'job_type': type_of_job_card,
            'salesman': salesman,
            'status': status,
            'supplier': supplier,
            'supplier_reference': supplier_reference,
            'estimated_delivery_date': estimated_delivery_date,
            'created_date':today_date_str,
            'last_modified_date':today_date_str
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
        return JsonResponse({"message": "Job Card created successfully", "id": job_card.id}, status=201)
    
    except Exception as e:
        # Log the error
        LogEntry.objects.create(
            user=request.user,
            action='ERROR',
            description=f"Error creating Job Card. Error: {e}"
        )
        
        return JsonResponse({"error": str(e)}, status=400)
    
@require_http_methods(["PUT"])
def update_job_card(request, job_card_id):
    try:
        data = json.loads(request.body)

        # Retrieve the existing job card
        job_card = JobCard.objects.get(id=job_card_id)

        # Update the job card fields from the request
        job_card.prescription_id = data.get('prescription', job_card.prescription_id)
        job_card.customer_id = data.get('customer', job_card.customer_id)
        job_card.job_type = data.get('typeOfJobCard', job_card.job_type)
        job_card.salesman = data.get('salesman', job_card.salesman)
        job_card.status = data.get('status', job_card.status)
        job_card.supplier = data.get('supplier', job_card.supplier)
        job_card.supplier_reference = data.get('supplierReference', job_card.supplier_reference)
        estimated_delivery_date = data.get('estimatedDeliveryDate', job_card.estimated_delivery_date)
        if estimated_delivery_date:
            job_card.estimated_delivery_date = datetime.strptime(estimated_delivery_date, '%Y-%m-%dT%H:%M:%S.%fZ').date()

        # Update additional fields based on the type of job card
        if job_card.job_type == 'lenses':
            job_card.frame = data.get('frame', job_card.frame)
            job_card.ht = data.get('ht', job_card.ht)
            job_card.lens = data.get('lens', job_card.lens)

        elif job_card.job_type == 'contactLenses':
            job_card.base_curve = data.get('baseCurve', job_card.base_curve)
            job_card.diameter = data.get('diameter', job_card.diameter)
            job_card.no_of_boxes = data.get('noOfBoxes', job_card.no_of_boxes)
            job_card.contact_lens = data.get('contactLens', job_card.contact_lens)

        # Save the changes to the job card
        job_card.last_modified_date = datetime.now() # Assuming you have a field for last modified date
        job_card.save()

        # Log the action
        LogEntry.objects.create(
            user=request.user,
            action=LogEntry.UPDATED,
            description=f"Job Card {job_card_id} of type {job_card.job_type} updated successfully."
        )

        return JsonResponse({'message': 'Job Card updated successfully'}, status=200)

    except JobCard.DoesNotExist:
        return JsonResponse({'message': 'Job Card not found'}, status=404)

    except Exception as e:
        LogEntry.objects.create(
            user=request.user,
            action=LogEntry.ERROR,
            description=f"Job Card {job_card_id} update failed. {str(e)}"
        )
        return JsonResponse({'message': str(e)}, status=500)
    
def get_all_job_cards(request):
	entries = JobCard.objects.select_related('customer').values(
        *{f.name for f in JobCard._meta.get_fields() if not f.is_relation or f.one_to_one or (f.many_to_one and f.related_model)},
        'customer__first_name',
        'customer__last_name'
    ).order_by('created_date')
    
	return JsonResponse({"values": list(entries)})

def get_job_card(request, job_card_id):
    print(job_card_id)
    job_card = JobCard.objects.get(id=job_card_id)
    print(job_card)
    return JsonResponse({"values": job_card.to_dict()})

@require_http_methods(["POST"])
def create_appointment(request):
    try:
        data = json.loads(request.body)
        print(data)
        # Parse the datetime string to a datetime object
        appointment_datetime = parse_datetime(data['appointmentDate'])
        print('appointment_datetime')
        print(appointment_datetime)
        # If the appointment_datetime is None, the string is not properly formatted.
        if not appointment_datetime:
            raise ValueError("Incorrect date format for 'appointmentDate'")

        # Extract the date component for the appointment_date
        appointment_date = appointment_datetime.date()
        print('appointment_date')
        print(appointment_date)
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
        form_data = json.loads(request.body)
        print(form_data)
        
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="prescription.pdf"'

        c = canvas.Canvas(response, pagesize=landscape(A5))
        width, height = landscape(A5)

        left_margin = 20
        top_margin = height - 60

        #c.setFont("Helvetica-Bold", 16)
        #c.drawString(left_margin, height - 30, "KLER VISION")

        # Patient Information and Prescription Grid
        c.setFont("Helvetica", 12)
        patient_info_start_height = top_margin
        grid_left_column = width - left_margin - 245  # This is the X position where your grid starts

        name_label_x = left_margin
        name_value_x = left_margin + 70  # You might need to adjust the 70 points to align it as you wish
        name_y = patient_info_start_height
        
        #c.drawString(name_label_x, name_y, "LOGO GOES HERE")
        image_path = 'static/img/logo.png'
        # Specify image position and size
        image_x = name_label_x + 40 # X-coordinate
        image_y = patient_info_start_height - 45  # Y-coordinate (from the bottom)
        image_width = 200  # Width of the image
        image_height = 100  # Height of the image

        # Draw the image
        c.drawImage(image_path, image_x, image_y, width=image_width,height=image_height)
        
        c.drawString(name_label_x, patient_info_start_height - 60, "Prescription ID: ")
        c.drawString(name_value_x + 40, name_y - 60, str(form_data.get('prescription_id', '')))

        c.drawString(name_label_x, patient_info_start_height - 100, "Name:")
        c.drawString(name_value_x, name_y - 100, str(form_data.get('customer', '')))
        c.drawString(name_label_x, patient_info_start_height - 120, "Care:")
        c.drawString(name_value_x, name_y - 120, str(form_data.get('care-system', '')))
        c.drawString(name_label_x, patient_info_start_height - 140, "Next:")
        c.drawString(name_value_x, name_y - 140, str(form_data.get('next-checkup-date', '')))
        
        c.drawString(name_label_x, patient_info_start_height - 260, "Doctor:")
        c.drawString(name_value_x, name_y - 260, "O. POLIN Optometrist")

        # Drawing the grid lines
        grid_height = patient_info_start_height + 15  # Starting just below the headers
        c.grid([grid_left_column, grid_left_column + 35, grid_left_column + 105, grid_left_column + 175, grid_left_column + 245],
               [grid_height, grid_height - 20, grid_height - 40, grid_height - 60])

        # Glass Prescription Headers
        c.drawString(grid_left_column, grid_height - 15, "")
        c.drawString(grid_left_column + 50, grid_height - 15, "Sphere:")
        c.drawString(grid_left_column + 117, grid_height - 15, "Cylinder:")
        c.drawString(grid_left_column + 200, grid_height - 15, "Axis:")
        
        # Glass Prescription First Column Headers
        c.drawString(grid_left_column + 12, grid_height - 34, "R:")
        c.drawString(grid_left_column + 12, grid_height - 53, "L:")
        
        # Glass Prescription First Row Values
        c.drawString(grid_left_column + 55, grid_height - 34, format_with_plus_if_positive(str(form_data.get('glass-right-sph', ''))))
        c.drawString(grid_left_column + 125, grid_height - 34, format_with_plus_if_positive(str(form_data.get('glass-right-cyl', ''))))
        c.drawString(grid_left_column + 195, grid_height - 34, str(form_data.get('glass-right-axis', '')))
        
        # Glass Prescription Second Row Values
        c.drawString(grid_left_column + 55, grid_height - 53, format_with_plus_if_positive(str(form_data.get('glass-left-sph', ''))))
        c.drawString(grid_left_column + 125, grid_height - 53, format_with_plus_if_positive(str(form_data.get('glass-left-cyl', ''))))
        c.drawString(grid_left_column + 195, grid_height - 53, str(form_data.get('glass-left-axis', '')))
        
        # Drawing the grid lines
        grid_height = height - 113  # Starting just below the headers
        c.grid([grid_left_column, grid_left_column + 55, grid_left_column + 105],
               [grid_height, grid_height - 20, grid_height - 40])
        
        # Glass Prescription First Column Headers
        c.drawString(grid_left_column + 12, grid_height - 14, "PD R:")
        c.drawString(grid_left_column + 12, grid_height - 33, "PD L:")
        
        # Glass Prescription First Row Values
        c.drawString(grid_left_column + 68, grid_height - 14, str(form_data.get('pdr', '')))
        c.drawString(grid_left_column + 68, grid_height - 33, str(form_data.get('pdl', '')))
        
        c.drawString(grid_left_column, patient_info_start_height - 120, "Type Of:")
        c.drawString(grid_left_column + 68, patient_info_start_height - 120, str(form_data.get('type-of-lenses', '')))
        c.drawString(grid_left_column, patient_info_start_height - 140, "Add:")
        c.drawString(grid_left_column + 68, patient_info_start_height - 140, str(form_data.get('glass-add', '')))
            
        #c.setFillColorRGB(0, 0, 0)
        # Drawing the grid lines
        grid_height = height - 250  # Starting just below the headers
        c.grid([grid_left_column, grid_left_column + 35, grid_left_column + 105, grid_left_column + 175, grid_left_column + 245],
               [grid_height, grid_height - 20, grid_height - 40, grid_height - 60])

        # Glass Prescription Headers
        c.drawString(grid_left_column, grid_height - 15, "")
        c.drawString(grid_left_column + 50, grid_height - 15, "Sphere:")
        c.drawString(grid_left_column + 117, grid_height - 15, "Cylinder:")
        c.drawString(grid_left_column + 200, grid_height - 15, "Axis:")
        
        # Glass Prescription First Column Headers
        c.drawString(grid_left_column + 12, grid_height - 34, "R:")
        c.drawString(grid_left_column + 12, grid_height - 53, "L:")
        
        # Glass Prescription First Row Values
        c.drawString(grid_left_column + 55, grid_height - 34, format_with_plus_if_positive(str(form_data.get('lens-right-sph', ''))))
        c.drawString(grid_left_column + 125, grid_height - 34, format_with_plus_if_positive(str(form_data.get('lens-right-cyl', ''))))
        c.drawString(grid_left_column + 195, grid_height - 34, format_with_plus_if_positive(str(form_data.get('lens-right-axis', ''))))
        
        # Glass Prescription Second Row Values
        c.drawString(grid_left_column + 55, grid_height - 53, format_with_plus_if_positive(str(form_data.get('lens-left-sph', ''))))
        c.drawString(grid_left_column + 125, grid_height - 53, format_with_plus_if_positive(str(form_data.get('lens-left-cyl', ''))))
        c.drawString(grid_left_column + 195, grid_height - 53, format_with_plus_if_positive(str(form_data.get('lens-left-axis', ''))))

        c.drawString(grid_left_column, patient_info_start_height - 280, "Type Of:")
        c.drawString(grid_left_column + 68, patient_info_start_height - 280, str(form_data.get('type-of-contact-lenses', '')))
        c.drawString(grid_left_column, patient_info_start_height - 300, "Add:")
        c.drawString(grid_left_column + 68, patient_info_start_height - 300, str(form_data.get('contact-lens-add', '')))
        
        # Glass Prescription Strip
        strip_x = grid_left_column  # X coordinate for the left side of the strip
        strip_y = height - 15  # Y coordinate for the top side of the strip
        strip_width = 245  # The width of the strip
        strip_height = 20  # The height of the strip
        strip_text = "Glass Prescription"  # The text you want to display

        # Set the fill color to black
        c.setFillColorRGB(0, 0, 0)  # RGB for black

        # Draw the rectangle
        c.rect(strip_x, strip_y - strip_height, strip_width, strip_height, stroke=0, fill=1)

        # Set the text color to white for contrast
        c.setFillColorRGB(1, 1, 1)  # RGB for white

        # Choose the font and size for the text
        c.setFont("Helvetica-Bold", 12)

        # Calculate the width of the text
        text_width = c.stringWidth(strip_text, "Helvetica-Bold", 12)

        # Position the text in the center of the strip
        text_x = strip_x + (strip_width - text_width) / 2
        text_y = strip_y - strip_height + (strip_height - 8) / 2  # Adjust the 12 if using a different font size

        # Draw the text on the strip
        c.drawString(text_x, text_y, strip_text)
        
        # Lens Prescription Strip
        strip_x = grid_left_column  # X coordinate for the left side of the strip
        strip_y = height - 220  # Y coordinate for the top side of the strip
        strip_width = 245  # The width of the strip
        strip_height = 20  # The height of the strip
        strip_text = "Lens Prescription"  # The text you want to display

        # Set the fill color to black
        c.setFillColorRGB(0, 0, 0)  # RGB for black

        # Draw the rectangle
        c.rect(strip_x, strip_y - strip_height, strip_width, strip_height, stroke=0, fill=1)

        # Set the text color to white for contrast
        c.setFillColorRGB(1, 1, 1)  # RGB for white

        # Choose the font and size for the text
        c.setFont("Helvetica-Bold", 12)

        # Calculate the width of the text
        text_width = c.stringWidth(strip_text, "Helvetica-Bold", 12)

        # Position the text in the center of the strip
        text_x = strip_x + (strip_width - text_width) / 2
        text_y = strip_y - strip_height + (strip_height - 8) / 2  # Adjust the 12 if using a different font size

        # Draw the text on the strip
        c.drawString(text_x, text_y, strip_text)
        
        # Lens Prescription Strip
        strip_x = 20  # X coordinate for the left side of the strip
        strip_y = 40  # Y coordinate for the top side of the strip
        strip_width = width - 40  # The width of the strip
        strip_height = 20  # The height of the strip
        strip_text = "Optical Zone Ltd | Valentina Mall | Tel: 5555 5555 | BRN: C0123541"  # The text you want to display

        # Set the fill color to black
        c.setFillColorRGB(0, 0, 0)  # RGB for black

        # Draw the rectangle
        c.rect(strip_x, strip_y - strip_height, strip_width, strip_height, stroke=0, fill=1)

        # Set the text color to white for contrast
        c.setFillColorRGB(1, 1, 1)  # RGB for white

        # Choose the font and size for the text
        c.setFont("Helvetica-Bold", 10)

        # Calculate the width of the text
        text_width = c.stringWidth(strip_text, "Helvetica-Bold", 10)

        # Position the text in the center of the strip
        text_x = strip_x + (strip_width - text_width) / 2
        text_y = strip_y - strip_height + (strip_height - 8) / 2  # Adjust the 12 if using a different font size

        # Draw the text on the strip
        c.drawString(text_x, text_y, strip_text)

        # Finalize PDF
        c.showPage()
        c.save()
        # Return the response
        return response
    except json.JSONDecodeError:
        return JsonResponse({'message': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)
    
def generate_job_card_pdf(request):
    try:
        form_data = json.loads(request.body)
        print('prescription_id')
        print(form_data)
        try:
            # Select related Prescription with the JobCard to minimize database hits
            job_card = JobCard.objects.select_related('prescription', 'customer').get(id=form_data['job_card_id'])
            prescription = job_card.prescription
            # Start building the response dictionary
            job_card_data = {
                'job_card': model_to_dict(job_card),
                'prescription': model_to_dict(prescription, exclude=['doctor', 'customer']),
            }

            # Add extra details from related objects
            job_card_data['prescription']['doctor_name'] = f"{prescription.doctor.first_name} {prescription.doctor.last_name}"
            job_card_data['prescription']['customer_name'] = f"{prescription.customer.first_name} {prescription.customer.last_name}"
            job_card_data['prescription']['customer_address'] = f"{prescription.customer.address}"
            job_card_data['prescription']['customer_tel'] = f"{prescription.customer.mobile_1}"
            job_card_data['prescription']['customer_id'] = prescription.customer.id

            # Try to get the GlassPrescription and its LensDetails
            try:
                glass_prescription = prescription.glass_prescription
                job_card_data['glass_prescription'] = {
                    "lens_detail_right": model_to_dict(glass_prescription.lens_detail_right),
                    "lens_detail_left": model_to_dict(glass_prescription.lens_detail_left),
                    "type_of_lenses": glass_prescription.type_of_lenses,
                    "pdr": glass_prescription.pdr,
                    "pdl": glass_prescription.pdl,
                    "glass_add": glass_prescription.glass_add
                }
            except ObjectDoesNotExist:
                job_card_data['glass_prescription'] = None

            # Try to get the ContactLensPrescription and its LensDetails
            try:
                contact_lens_prescription = prescription.contact_lens_prescription
                job_card_data['contact_lens_prescription'] = {
                    "type_of_contact_lenses": contact_lens_prescription.type_of_contact_lenses,
                    "lens_detail_right": model_to_dict(contact_lens_prescription.lens_detail_right),
                    "lens_detail_left": model_to_dict(contact_lens_prescription.lens_detail_left),
                    "contact_lens_add": contact_lens_prescription.contact_lens_add
                }
            except ObjectDoesNotExist:
                job_card_data['contact_lens_prescription'] = None
        except JobCard.DoesNotExist:
            job_card_data['error'] = {"error": "Job Card not found"}
        print('response')
        
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="prescription.pdf"'

        c = canvas.Canvas(response, pagesize=landscape(A5))
        width, height = landscape(A5)

        left_margin = 20
        top_margin = height - 60

        c.setFont("Helvetica", 12)
        patient_info_start_height = top_margin
        grid_left_column = width - left_margin - 245  # This is the X position where your grid starts

        name_label_x = left_margin
        name_value_x = left_margin + 70
        
        c.drawString(width/3, patient_info_start_height + 30, "KLER OPTICS | Valentina Mall")
        
        c.drawString(name_label_x, patient_info_start_height, "Job Card ID: ")
        c.drawString(name_value_x + 20, patient_info_start_height, str(job_card_data.get('job_card', {}).get('id', '-')))
        c.drawString(grid_left_column, patient_info_start_height, "Prescription ID:")
        c.drawString(grid_left_column + 100, patient_info_start_height, str(job_card_data.get('prescription', {}).get('id', '-')))
        
        c.drawString(name_label_x, patient_info_start_height - 30, "Date:")
        c.drawString(name_value_x + 20, patient_info_start_height - 30, str(job_card_data.get('job_card', {}).get('created_date', '-')))
        
        c.drawString(name_label_x, patient_info_start_height - 60, "Name:")
        c.drawString(name_value_x + 20, patient_info_start_height - 60, str(job_card_data.get('prescription', {}).get('customer_name', '-')))
        
        c.drawString(name_label_x, patient_info_start_height - 90, "Address:")
        c.drawString(name_value_x + 20, patient_info_start_height - 90, str(job_card_data.get('prescription', {}).get('customer_address', '-')))
        
        c.drawString(name_label_x, patient_info_start_height - 120, "Tel:")
        c.drawString(name_value_x + 20, patient_info_start_height - 120, str(job_card_data.get('prescription', {}).get('customer_tel', '-')))
        
        c.drawString(name_label_x, patient_info_start_height - 150, "R:")
        c.drawString(name_value_x + 20, patient_info_start_height - 150, str(job_card_data.get('glass_prescription', '-').get('lens_detail_right', '-').get('sph', '-')))
        c.drawString(name_value_x + 55, patient_info_start_height - 150, "/")
        c.drawString(name_value_x + 60, patient_info_start_height - 150, str(job_card_data.get('glass_prescription', '-').get('lens_detail_right', '-').get('cyl', '-')))
        c.drawString(name_value_x + 95, patient_info_start_height - 150, "/")
        c.drawString(name_value_x + 100, patient_info_start_height - 150, str(job_card_data.get('glass_prescription', '-').get('lens_detail_right', '-').get('axis', '-')))
        c.drawString(grid_left_column, patient_info_start_height - 150, "PDR:")
        c.drawString(grid_left_column + 100, patient_info_start_height - 150, str(job_card_data.get('glass_prescription', '-').get('pdr', '-')))
        
        c.drawString(grid_left_column, patient_info_start_height - 180, "ADD:")
        c.drawString(grid_left_column + 100, patient_info_start_height - 180, str(form_data.get('glass_add', '-')))

        c.drawString(name_label_x, patient_info_start_height - 210, "L:")
        c.drawString(name_value_x + 20, patient_info_start_height - 210, str(job_card_data.get('glass_prescription', '-').get('lens_detail_left', '-').get('sph', '-')))
        c.drawString(name_value_x + 55, patient_info_start_height - 210, "/")
        c.drawString(name_value_x + 60, patient_info_start_height - 210, str(job_card_data.get('glass_prescription', '-').get('lens_detail_right', '-').get('cyl', '-')))
        c.drawString(name_value_x + 95, patient_info_start_height - 210, "/")
        c.drawString(name_value_x + 100, patient_info_start_height - 210, str(job_card_data.get('glass_prescription', '-').get('lens_detail_right', '-').get('axis', '-')))
        c.drawString(grid_left_column, patient_info_start_height - 210, "PDR:")
        c.drawString(grid_left_column + 100, patient_info_start_height - 210, str(job_card_data.get('glass_prescription', '-').get('pdl', '-')))
        
        c.drawString(name_label_x, patient_info_start_height - 240, "HT:")
        c.drawString(name_value_x + 20, patient_info_start_height - 240, str(job_card_data.get('job_card', '-').get('ht', '-')))
        
        c.drawString(name_label_x, patient_info_start_height - 270, "Base Curve:")
        c.drawString(name_value_x + 20, patient_info_start_height - 270, str(job_card_data.get('job_card', '-').get('base_curve', '-')))
        c.drawString(grid_left_column, patient_info_start_height - 270, "Diameter:")
        c.drawString(grid_left_column + 100, patient_info_start_height - 270, str(job_card_data.get('job_card', '-').get('diameter', '-')))
        
        c.drawString(name_label_x, patient_info_start_height - 300, "Frame:")
        c.drawString(name_value_x + 20, patient_info_start_height - 300, str(job_card_data.get('job_card', '-').get('frame', '-')))
        
        c.drawString(name_label_x, patient_info_start_height - 330, "Lenses:")
        c.drawString(name_value_x + 20, patient_info_start_height - 330, str(job_card_data.get('job_card', '-').get('lens', '-')))
        
        # Finalize PDF
        c.showPage()
        c.save()
        # Return the response
        return response
    except json.JSONDecodeError:
        return JsonResponse({'message': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)
    
@require_http_methods(["POST"])
def create_product(request):
    try:
        data = json.loads(request.body)
        
        # Assuming that category, supplier, and location are provided as names, not IDs
        category, _ = Category.objects.get_or_create(name=data.get('category'))
        supplier, _ = Supplier.objects.get_or_create(name=data.get('supplier'))
        location, _ = Location.objects.get_or_create(storage_location=data.get('location'))

        # Handle the image, converting it from base64 to an image file
        image_data = data.get('image', [])
        image = None
        if image_data:
            format, imgstr = image_data[0]['thumbUrl'].split(';base64,') # You might need to adjust this depending on the actual format of your image data
            ext = format.split('/')[-1]
            image = ContentFile(base64.b64decode(imgstr), name='temp.' + ext) # 'temp.' is used as a filename prefix; you might want to change this

        # Create the product instance
        product = Product.objects.create(
            item_id=data.get('itemId'),
            item_name=data.get('itemName'),
            category=category,
            quantity=data.get('quantity'),
            unit_price=data.get('unitPrice'),
            location=location,
            supplier=supplier,
            date_of_purchase=datetime.strptime(data.get('dateOfPurchase'), "%Y-%m-%dT%H:%M:%S.%fZ").date(),
            reorder_level=data.get('reorderLevel'),
            expiry_date=datetime.strptime(data.get('expiryDate'), "%Y-%m-%dT%H:%M:%S.%fZ").date() if data.get('expiryDate') else None,
            status=data.get('status'),
            serial_number_or_barcode=data.get('serialNumber'),
            sku=data.get('sku'),
            image=image
        )

        # Saving the product to handle image file correctly
        product.save()

        return JsonResponse({"message": "Product added successfully.", "id": product.id}, status=201)
    
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=400)
    
#@login_required(login_url='/accounts/login/')
def get_all_products(request):
	entries = (
		Product.objects.values("id", "item_name", "quantity", "unit_price", "image")
	)
	return JsonResponse({"values": list(entries)})

#@login_required(login_url='/accounts/login/')
def get_product(request, product_id):
	product = Product.objects.get(id=product_id)
	return JsonResponse({"values": product.to_dict()})

@require_http_methods(["PUT"])
def update_product(request, product_id):
    try:
        data = json.loads(request.body)
        product = Product.objects.get(id=product_id)

        # Update fields
        product.item_name = data.get('itemName', product.item_name)
        product.quantity = data.get('quantity', product.quantity)
        product.unit_price = data.get('unitPrice', product.unit_price)
        product.reorder_level = data.get('reorderLevel', product.reorder_level)
        product.status = data.get('status', product.status)
        product.serial_number_or_barcode = data.get('serialNumber', product.serial_number_or_barcode)
        product.sku = data.get('sku', product.sku)

        # Update dates
        if data.get('dateOfPurchase'):
            product.date_of_purchase = parse_datetime(data.get('dateOfPurchase'))
        if data.get('expiryDate'):
            product.expiry_date = parse_datetime(data.get('expiryDate'))

        # Update ForeignKey fields (Category, Supplier, Location)
        if data.get('category'):
            category, _ = Category.objects.get_or_create(name=data.get('category'))
            product.category = category
        if data.get('supplier'):
            supplier, _ = Supplier.objects.get_or_create(name=data.get('supplier'))
            product.supplier = supplier
        if data.get('location'):
            location, _ = Location.objects.get_or_create(storage_location=data.get('location'))
            product.location = location

        # Update image if it exists
        image_data = data.get('image')
        print('in1')
        #print(image_data[0]['thumbUrl'])
        if 'thumbUrl' in image_data[0]:
            print('in2')
            format, imgstr = image_data[0]['thumbUrl'].split(';base64,')
            ext = format.split('/')[-1]
            product.image = ContentFile(base64.b64decode(imgstr), name=f'{product.item_id}.{ext}')

        product.save()

        return JsonResponse({'message': 'Product updated successfully'}, status=200)
    except Product.DoesNotExist:
        return JsonResponse({'message': 'Product not found'}, status=404)
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)
    
@require_http_methods(["POST"])
def create_invoice(request):
    try:
        data = json.loads(request.body)
        customer = Customer.objects.get(id=data.get('customer'))

        try:
            latest_invoice = Invoice.objects.latest('id')
            new_invoice_number = f"INV-{latest_invoice.id + 1}"
        except Invoice.DoesNotExist:
            new_invoice_number = "INV-1"


        invoice = Invoice.objects.create(
            invoice_number=new_invoice_number,
            date=parse_datetime(data['date']),
            customer=customer,
            total_amount=data.get('totalAmount', 0),
        )
        
        line_items = data.get('items', [])
        for item in line_items:
            if item['item'] == 'product':
                product = Product.objects.get(id=item['product'])
                if product.quantity < item['quantity']:
                    raise ValueError(f"Not enough quantity for product {product.item_name}")

                # Deduct the quantity from the product inventory
                product.quantity -= item['quantity']
                product.save()

                InvoiceLineItem.objects.create(
                    invoice=invoice,
                    item=item['item'],
                    product=product,
                    description=item['description'],
                    quantity=item['quantity'],
                    unit_price=item['unitPrice'],
                )
            else:
                # Handle non-product items like 'consultation'
                InvoiceLineItem.objects.create(
                    invoice=invoice,
                    item=item['item'],
                    description=item['description'],
                    quantity=item['quantity'],
                    unit_price=item['unitPrice'],
                )

        invoice.save()

        return JsonResponse({"message": "Invoice created successfully.", "id": invoice.id}, status=201)
    except Customer.DoesNotExist:
        return JsonResponse({"message": "Customer not found"}, status=404)
    except Product.DoesNotExist:
        return JsonResponse({"message": "Product not found"}, status=404)
    except ValueError as e:
        return JsonResponse({"message": str(e)}, status=400)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)

def get_all_invoices(request):
    invoices = Invoice.objects.all().select_related("customer").values(
        "id", "invoice_number", "date", "customer__first_name", "total_amount"
    )
    return JsonResponse({"values": list(invoices)})


def get_invoice(request, invoice_id):
    try:
        invoice = Invoice.objects.get(id=invoice_id)
        invoice_data = {
            "invoiceNumber": invoice.invoice_number,
            "date": invoice.date,
            #"customerName": invoice.customer.name,
            # Add other fields as necessary
            "lineItems": list(invoice.line_items.values("item", "description", "quantity", "unit_price"))
        }
        return JsonResponse({"invoice": invoice_data})
    except Invoice.DoesNotExist:
        return JsonResponse({'message': 'Invoice not found'}, status=404)

@require_http_methods(["PUT"])
def update_invoice(request, invoice_id):
    try:
        data = json.loads(request.body)
        invoice = Invoice.objects.get(id=invoice_id)

        # Update invoice fields
        invoice.date = datetime.strptime(data.get('date', str(invoice.date)), "%Y-%m-%d").date()
        #invoice.downpayment_percentage = data.get('downpaymentPercentage', invoice.downpayment_percentage)
        #invoice.discount_type = data.get('discountType', invoice.discount_type)
        #invoice.discount_amount = data.get('discountAmount', invoice.discount_amount)
        invoice.total_amount = data.get('totalAmount', invoice.total_amount)
        #invoice.discounted_total = data.get('discountedTotal', invoice.discounted_total)
        #invoice.balance_due = data.get('balanceDue', invoice.balance_due)

        invoice.save()

        # Update line items
        line_items_data = data.get('lineItems', [])
        for item_data in line_items_data:
            line_item, created = InvoiceLineItem.objects.update_or_create(
                invoice=invoice,
                id=item_data.get('id'),  # Assuming each line item's data includes its ID
                defaults={
                    'item': item_data['item'],
                    'description': item_data['description'],
                    'quantity': item_data['quantity'],
                    'unit_price': item_data['unit_price'],
                }
            )

        return JsonResponse({'message': 'Invoice updated successfully'}, status=200)
    except Invoice.DoesNotExist:
        return JsonResponse({'message': 'Invoice not found'}, status=404)
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)