from django.urls import re_path, path
from dashboard import views

app_urls = [
	path("add_customers", views.add_customer),
 	path("get_all_customers", views.get_all_customers),
]

urlpatterns = [
   	re_path(r'^$', views.dashboard_render, name='index'),
] + app_urls