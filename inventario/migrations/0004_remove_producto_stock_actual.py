# Generated by Django 5.0.7 on 2024-08-02 17:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('inventario', '0003_alter_cliente_tipocedula_alter_proveedor_tipocedula'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='producto',
            name='stock_actual',
        ),
    ]