from django.db import models
from django.core.validators import RegexValidator

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
    mobile1 = models.CharField(validators=[phone_regex], max_length=17, blank=False)
    mobile2 = models.CharField(validators=[phone_regex], max_length=17, blank=True, null=True)
    address = models.TextField()
    city = models.CharField(max_length=100)
    email = models.EmailField()
    nic_number = models.CharField(max_length=20, blank=True, null=True)
    profession = models.CharField(max_length=100, blank=True, null=True)
    insurance = models.CharField(max_length=50, choices=INSURANCE_CHOICES)

class Prescription(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    doctor_name = models.CharField(max_length=255)
    last_eye_test = models.DateField(null=True, blank=True)
    next_checkup = models.DateField(null=True, blank=True)
    care_system = models.CharField(max_length=255, blank=True)
    recommendation = models.TextField(blank=True)

class Vision(models.Model):
    prescription = models.ForeignKey(Prescription, related_name='visions', on_delete=models.CASCADE)
    type = models.CharField(max_length=255, choices=(('Right', 'Right'), ('Left', 'Left')))
    sph = models.DecimalField(max_digits=10, decimal_places=2)
    cyl = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    axis = models.IntegerField(blank=True, null=True)
    pdl = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)  # Pupil Distance Left

class LensPrescription(models.Model):
    prescription = models.ForeignKey(Prescription, related_name='lens_prescriptions', on_delete=models.CASCADE)
    side = models.CharField(max_length=255, choices=(('Right', 'Right'), ('Left', 'Left')))
    sph = models.DecimalField(max_digits=10, decimal_places=2)
    cyl = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    axis = models.IntegerField(blank=True, null=True)
    type_of_lenses = models.CharField(max_length=255, blank=True)  # This can be a ForeignKey if lens types are predefined