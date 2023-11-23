from django.db import models
from django.contrib.auth.models import User

class LogEntry(models.Model):
    CREATED = 'CREATED'
    UPDATED = 'UPDATED'
    DELETED = 'DELETED'
    ERROR = 'ERROR'
    LOG_CHOICES = [
        (CREATED, 'Created'),
        (UPDATED, 'Updated'),
        (DELETED, 'Deleted'),
        (ERROR, 'Error'),
    ]

    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='log_entries')
    action = models.CharField(max_length=10, choices=LOG_CHOICES)
    description = models.TextField()

    def __str__(self):
        return f"LogEntry {self.action} at {self.timestamp}"
