# Generated by Django 4.2.7 on 2024-01-16 19:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0017_contactlensprescription_contact_lens_add_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lensdetails',
            name='axis',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]