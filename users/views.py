from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import JsonResponse
from .models import UserProfile
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required

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
        user_profile_data = {
            "role": user_profile.role,
            "region": user_profile.region,
        }
    except UserProfile.DoesNotExist:
        user_profile_data = {}

    user_data["profile"] = user_profile_data

    return JsonResponse(user_data)
