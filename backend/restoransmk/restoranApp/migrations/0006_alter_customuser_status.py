# Generated by Django 5.2 on 2025-04-10 04:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restoranApp', '0005_transaksi_status_pembayaran_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='status',
            field=models.CharField(choices=[('admin', 'admin'), ('pelanggan', 'pelanggan')], default='pelanggan', max_length=15),
        ),
    ]
