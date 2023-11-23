import json
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from log.models import LogEntry
from .models import Prescription, GlassPrescription, ContactLensPrescription, LensDetails, Customer
from datetime import datetime


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
            insurance=data.get('insurance')
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
		Customer.objects.values("id", "title", "first_name", "last_name", "date_of_birth", "mobile_1", "mobile_2", "address", "city", "email", "nic_number", "profession", "insurance")
	)
	return JsonResponse({"values": list(entries)})

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
            vision=data.get('vision', '')
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
		Prescription.objects.select_related("").values("id", "title", "first_name", "last_name", "date_of_birth", "mobile_1", "mobile_2", "address", "city", "email", "nic_number", "profession", "insurance")
	)
	return JsonResponse({"values": list(entries)})