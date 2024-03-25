from django.db import models
from django.contrib.auth.models import User

from app_config.models import Business

class Role(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
        
class Region(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    roles = models.ManyToManyField(Role)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True)  
    manager = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subordinates')
    business = models.ForeignKey(Business, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {', '.join(role.name for role in self.roles.all())} - {self.region}"

    def get_all_subordinates(self):
        """Recursively gets all subordinates of this user."""
        subordinates = list(self.subordinates.all())
        for subordinate in subordinates:
            subordinates.extend(subordinate.get_all_subordinates())
        return subordinates

