from django.urls import re_path, path
from django.views.generic import TemplateView
from dashboard import views

app_urls = [
	path("create_customer", views.add_customer),
 	path("get_all_customers", views.get_all_customers),
    path("get_customer/<int:customer_id>/", views.get_customer),
    path("update_customer/<int:customer_id>/", views.update_customer, name="update_customer"),
    
    path('create_prescription/', views.create_prescription, name='create_prescription'),
    path("get_all_prescriptions", views.get_all_prescriptions),
]

urlpatterns = [
   	re_path(r'^$', views.dashboard_render, name='index'),
] + app_urls