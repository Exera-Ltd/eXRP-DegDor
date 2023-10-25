from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.
def dashboard_render (request):
	"""
	Render function for Dashboard Index page
	"""
	# fullname = request.user.get_full_name()
	return render(request, 'dashboard/index.html', {"fullname": "Pleo"})