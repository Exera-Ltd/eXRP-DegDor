# Generated by Django 4.2.7 on 2024-02-01 00:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0029_alter_customer_created_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='date_of_purchase',
            field=models.DateField(blank=True, null=True),
        ),
    ]
