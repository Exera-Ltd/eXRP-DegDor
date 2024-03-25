from django.urls import include, re_path, path
from django.conf import settings
from django.contrib.auth.views import LogoutView
from app_config import views

urlpatterns = [
    path('business', views.BusinessListAPIView.as_view(), name='business-list'),
]