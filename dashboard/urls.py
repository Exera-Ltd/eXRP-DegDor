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
    path("get_prescription/<int:prescription_id>/", views.get_prescription),
    path("update_prescription/<int:prescription_id>/", views.update_prescription, name="update_prescription"),
    path("generate_prescription_pdf", views.generate_prescription_pdf),
    path("get_prescriptions_by_customer/<int:customer_id>/", views.get_prescriptions_by_customer),
    
    path('create_job_card/', views.create_job_card, name='create_job_card'),
    path("get_all_job_cards", views.get_all_job_cards),
    path("get_job_card/<int:job_card_id>/", views.get_job_card),
    path("update_job_card/<int:job_card_id>/", views.update_job_card, name="update_job_card"),
    path("generate_job_card_pdf", views.generate_job_card_pdf),
        
    path('create_appointment/', views.create_appointment, name='create_appointment'),
    path("get_all_appointments", views.get_all_appointments),
    path("get_appointment/<int:appointment_id>/", views.get_appointment),
    path("update_appointment/<int:appointment_id>/", views.update_appointment, name='update_appointment'),
]

urlpatterns = [
   	re_path(r'^$', views.dashboard_render, name='index'),
] + app_urls