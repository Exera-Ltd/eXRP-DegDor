from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import User
from datetime import datetime, date
from django.forms.models import model_to_dict

# Validators
phone_regex = RegexValidator(
    regex=r'^\+?1?\d{9,15}$',
    message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
)

class Customer(models.Model):
    
    TITLE_CHOICES = [
        ('Mr', 'Mr'),
        ('Mrs', 'Mrs'),
        ('Miss', 'Miss'),
    ]

    INSURANCE_CHOICES = [
        ('Swan', 'Swan'),
        ('Mauritius Union', 'Mauritius Union'),
    ]

    title = models.CharField(max_length=10, choices=TITLE_CHOICES)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    date_of_birth = models.DateTimeField()
    mobile_1 = models.CharField(validators=[phone_regex], max_length=17, blank=False)
    mobile_2 = models.CharField(validators=[phone_regex], max_length=17, blank=True, null=True)
    address = models.TextField()
    city = models.CharField(max_length=100)
    email = models.EmailField()
    nic_number = models.CharField(max_length=20, blank=True, null=True)
    profession = models.CharField(max_length=100, blank=True, null=True)
    insurance = models.CharField(max_length=50, choices=INSURANCE_CHOICES)
    created_date = models.DateField(default=datetime.strftime(date.today(), "%Y-%m-%d"))
    last_modified_date = models.DateField(default=datetime.strftime(date.today(), "%Y-%m-%d"))
    
    def to_dict(self):
        """
        Returns a dictionary representation of this Customer instance.
        """
        return model_to_dict(self, fields=[field.name for field in self._meta.fields])

class Prescription(models.Model):
    CARE_SYSTEM_CHOICES = [
        ('Permanent', 'Permanent'),
        ('Temporary', 'Temporary'),
    ]
    
    doctor = models.ForeignKey(User, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    last_eye_test = models.CharField(max_length=255, blank=True)
    care_system = models.CharField(max_length=255, choices=CARE_SYSTEM_CHOICES, blank=True)
    recommendation = models.TextField(blank=True)
    next_checkup = models.DateField(null=True, blank=True)
    vision = models.CharField(max_length=255, blank=True)
    created_date = models.DateField(default=datetime.strftime(date.today(), "%Y-%m-%d"))
    last_modified_date = models.DateField(default=datetime.strftime(date.today(), "%Y-%m-%d"))

class LensDetails(models.Model):
    side = models.CharField(max_length=5, choices=(('Right', 'Right'), ('Left', 'Left')))
    sph = models.DecimalField(max_digits=10, decimal_places=2)
    cyl = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    axis = models.IntegerField(blank=True, null=True)

class GlassPrescription(models.Model):
    prescription = models.OneToOneField(Prescription, on_delete=models.CASCADE, related_name='glass_prescription')
    lens_detail_right = models.OneToOneField(LensDetails, related_name='right_glass_prescription', on_delete=models.CASCADE)
    lens_detail_left = models.OneToOneField(LensDetails, related_name='left_glass_prescription', on_delete=models.CASCADE)
    type_of_lenses = models.CharField(max_length=255, blank=True)
    pdr = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    pdl = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

class ContactLensPrescription(models.Model):
    prescription = models.OneToOneField(Prescription, on_delete=models.CASCADE, related_name='contact_lens_prescription')
    lens_detail_right = models.OneToOneField(LensDetails, related_name='right_contact_prescription', on_delete=models.CASCADE)
    lens_detail_left = models.OneToOneField(LensDetails, related_name='left_contact_prescription', on_delete=models.CASCADE)