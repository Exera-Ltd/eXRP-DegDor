# Generated by Django 4.2.7 on 2024-01-11 09:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0005_jobcard_estimated_delivery_date_jobcard_no_of_boxes_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobcard',
            name='customer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='dashboard.customer'),
        ),
    ]