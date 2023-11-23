from django.urls import path
from log import views

log_urls = [
 	path("get_all_logs", views.get_all_logs),
]

urlpatterns = [
] + log_urls