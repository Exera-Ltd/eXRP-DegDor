from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):    
    ROLE_CHOICES = (
        ('Staff', 'Staff'),
        ('Doctor', 'Doctor'),
        ('Administrator', 'Administrator'),
    )
    
    REGIONS = (
        ('Flacq', 'Flacq'),
        ('Grand Port', 'Grand Port'),
        ('Moka', 'Moka'),
        ('Pamplemousses', 'Pamplemousses'),
        ('Plaines Wilhems', 'Plaines Wilhems'),
        ('Port Louis', 'Port Louis'),
        ('Rivière du Rempart', 'Rivière du Rempart'),
        ('Rivière Noire', 'Rivière Noire'),
        ('Savanne', 'Savanne'),
        ('Rodrigues', 'Rodrigues'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=100, choices=ROLE_CHOICES, default='Staff')
    region = models.CharField(max_length=100, choices=REGIONS, default='Plaines Wilhems')
    manager = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subordinates')

    def __str__(self):
        return f"{self.user.username} - {self.role} - {self.region}"

    def get_all_subordinates(self):
        """Recursively gets all subordinates of this user."""
        subordinates = list(self.subordinates.all())
        for subordinate in subordinates:
            subordinates.extend(subordinate.get_all_subordinates())
        return subordinates