import json
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Customer


# Create your views here.
def dashboard_render (request):
	"""
	Render function for Dashboard Index page
	"""
	# fullname = request.user.get_full_name()
	return render(request, 'dashboard/index.html', {"fullname": "Pleo"})

@require_http_methods(["POST"])  # This view will only accept POST requests
def add_customer(request):
    try:
        data = json.loads(request.body)
        
        # Check for duplicate customer
        existing_customer = Customer.objects.filter(
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            nic_number=data.get('nic_number')
        ).first()

        if existing_customer:
            return JsonResponse({"message": "Duplicate customer found."}, status=400)

        customer = Customer(
            title=data.get('title'),
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            date_of_birth=data.get('date_of_birth'),
            mobile1=data.get('mobile1'),
            mobile2=data.get('mobile2', ''),
            address=data.get('address'),
            city=data.get('city'),
            email=data.get('email'),
            nic_number=data.get('nic_number', ''),
            profession=data.get('profession', ''),
            insurance=data.get('insurance')
        )
        
        customer.save()

        return JsonResponse({"message": "Customer added successfully."}, status=201)

    except Exception as e:
        return JsonResponse({"message": str(e)}, status=400)

def get_all_customers(request):
    
	entries = (
		Customer.objects.values("id", "first_name", "last_name", "mobile1", "city", "nic_number")
	)

	
	return JsonResponse({"values": list(entries)})