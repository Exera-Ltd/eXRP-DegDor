from django.shortcuts import render
from app_config.models import Business
from app_config.serializers import BusinessSerializer
from rest_framework import generics
from django.shortcuts import render
# Create your views here.

class BusinessListAPIView(generics.ListAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer