from django.db import models
from django.contrib.auth.models import User
from django.http import JsonResponse
from log.models import LogEntry

#@login_required(login_url='/accounts/login/')
def get_all_logs(request):
	entries = (
		LogEntry.objects.select_related("user").values("id", "timestamp", "action", "description", "user__first_name")
	)
	return JsonResponse({"values": list(entries)})