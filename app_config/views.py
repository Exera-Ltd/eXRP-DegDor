from django.shortcuts import render
from app_config.serializers import BusinessSerializer
from models import Business
# Create your views here.

class BusinessListAPIView(generics.ListAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer