# Generated by Django 4.2.7 on 2023-11-28 05:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='created_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='customer',
            name='last_modified_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='prescription',
            name='created_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='prescription',
            name='last_modified_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]