from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import JsonResponse
from .models import UserProfile
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required
from rest_framework import generics
from .models import Role
from .serializers import RoleSerializer

@login_required(login_url='/accounts/login/')
def get_user(request):
    user = request.user
    print(user.groups)
    user_data = {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }

    try:
        user_profile = UserProfile.objects.get(user=user)
        user_roles = list(user_profile.roles.values_list('name', flat=True))
        user_profile_data = {
            "roles": user_roles,
            "region": user_profile.region.name,
        }
    except UserProfile.DoesNotExist:
        user_profile_data = {}

    user_data["profile"] = user_profile_data

    return JsonResponse(user_data)

class RoleListAPIView(generics.ListAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
