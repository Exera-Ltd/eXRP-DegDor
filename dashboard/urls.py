from django.urls import re_path
from dashboard import views

urlpatterns = [
   	re_path(r'^$', views.dashboard_render, name='index'),
]