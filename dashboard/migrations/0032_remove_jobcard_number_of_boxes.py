# Generated by Django 4.2.7 on 2024-02-01 02:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0031_alter_product_reorder_level'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='jobcard',
            name='number_of_boxes',
        ),
    ]