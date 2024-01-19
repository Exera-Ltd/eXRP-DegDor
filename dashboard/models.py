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
    email = models.EmailField(blank=True, null=True)
    nic_number = models.CharField(max_length=20, blank=True, null=True)
    profession = models.CharField(max_length=100, blank=True, null=True)
    insurance = models.CharField(max_length=50, choices=INSURANCE_CHOICES, blank=True, null=True)
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
    
    def to_dict(self):
        return model_to_dict(self, fields=[field.name for field in self._meta.fields])

class LensDetails(models.Model):
    side = models.CharField(max_length=5, choices=(('Right', 'Right'), ('Left', 'Left')))
    sph = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    cyl = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    axis = models.IntegerField(blank=True, null=True)

class GlassPrescription(models.Model):
    prescription = models.OneToOneField(Prescription, on_delete=models.CASCADE, related_name='glass_prescription')
    lens_detail_right = models.OneToOneField(LensDetails, related_name='right_glass_prescription', on_delete=models.CASCADE)
    lens_detail_left = models.OneToOneField(LensDetails, related_name='left_glass_prescription', on_delete=models.CASCADE)
    type_of_lenses = models.CharField(max_length=255, blank=True, null=True)
    pdr = models.CharField(max_length=255, blank=True, null=True)
    pdl = models.CharField(max_length=255, blank=True, null=True)
    glass_add = models.CharField(max_length=255, blank=True, null=True)
    
    def to_dict(self):
        return model_to_dict(self, fields=[field.name for field in self._meta.fields])

class ContactLensPrescription(models.Model):
    prescription = models.OneToOneField(Prescription, on_delete=models.CASCADE, related_name='contact_lens_prescription')
    type_of_contact_lenses = models.CharField(max_length=255, blank=True)
    lens_detail_right = models.OneToOneField(LensDetails, related_name='right_contact_prescription', on_delete=models.CASCADE)
    lens_detail_left = models.OneToOneField(LensDetails, related_name='left_contact_prescription', on_delete=models.CASCADE)
    contact_lens_add = models.CharField(max_length=255, blank=True, null=True)
    
    def to_dict(self):
        return model_to_dict(self, fields=[field.name for field in self._meta.fields])
    
class JobCard(models.Model):
    TYPE_CHOICES = (
        ('contact_lenses', 'Contact Lenses'),
        ('lenses', 'Lenses'),
    )
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, blank=True, null=True)
    job_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    supplier = models.CharField(max_length=100, blank=True, null=True)
    salesman = models.CharField(max_length=100, blank=True, null=True)
    number_of_boxes = models.IntegerField(blank=True, null=True)
    contact_lens = models.CharField(max_length=100, blank=True, null=True)
    lens = models.CharField(max_length=100, blank=True, null=True)
    base_curve = models.CharField(max_length=100, blank=True, null=True)
    diameter = models.CharField(max_length=100, blank=True, null=True)
    ht = models.CharField(max_length=100, blank=True, null=True)
    frame = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=100, blank=True, null=True)
    supplier_reference = models.CharField(max_length=100, blank=True, null=True)
    estimated_delivery_date = models.DateTimeField(null=True, blank=True)
    no_of_boxes = models.IntegerField(null=True, blank=True)
    created_date = models.DateField(default=datetime.strftime(date.today(), "%Y-%m-%d"))
    last_modified_date = models.DateField(default=datetime.strftime(date.today(), "%Y-%m-%d"))

    prescription = models.ForeignKey(Prescription,on_delete=models.SET_NULL,null=True,blank=True,related_name='job_cards')

    def __str__(self):
        return f"{self.get_job_type_display()} - {self.supplier or 'No Supplier'}"
    
    def to_dict(self):
        return model_to_dict(self, fields=[field.name for field in self._meta.fields])
    
class Appointment(models.Model):
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        # Add more status choices as needed
    )

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='appointments')
    appointment_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    doctor = models.ForeignKey(User, on_delete=models.CASCADE)
    number_of_patients = models.PositiveIntegerField(default=1)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Appointment on {self.appointment_date} with {self.doctor}"
    
    def to_dict(self):
        return model_to_dict(self, fields=[field.name for field in self._meta.fields])