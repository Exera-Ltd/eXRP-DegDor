# Generated by Django 4.2.7 on 2024-02-01 00:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0030_alter_product_date_of_purchase'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='reorder_level',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]
