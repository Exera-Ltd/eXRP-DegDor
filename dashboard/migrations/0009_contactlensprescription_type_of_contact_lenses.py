# Generated by Django 4.2.7 on 2024-01-14 04:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0008_alter_customer_created_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='contactlensprescription',
            name='type_of_contact_lenses',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
