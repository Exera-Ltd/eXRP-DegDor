from django.db import models

# Create your models here.

class Business(models.Model):
    name = models.CharField(max_length=100, unique=True)
    logo = models.ImageField(upload_to='static/img/business_images/', blank=True, null=True)
    address = models.CharField(max_length=200, blank=True)
    brn = models.CharField(blank=True)
    website = models.URLField(blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self.name