# Generated by Django 5.2 on 2025-04-11 02:57

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restoranApp', '0008_alter_meja_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transaksi',
            name='kekurangan',
        ),
        migrations.RemoveField(
            model_name='transaksi',
            name='metode_pembayaran',
        ),
        migrations.RemoveField(
            model_name='transaksi',
            name='metode_pembayaran_trx',
        ),
        migrations.RemoveField(
            model_name='transaksi',
            name='nominal_dp',
        ),
        migrations.RemoveField(
            model_name='transaksi',
            name='status_pembayaran',
        ),
        migrations.RemoveField(
            model_name='transaksi',
            name='total_bayar',
        ),
        migrations.AlterField(
            model_name='transaksi',
            name='status_transaksi',
            field=models.CharField(choices=[('pending', 'Pending'), ('reserved', 'Reserved'), ('checkin', 'Check-in'), ('done', 'Done'), ('failed', 'Failed')], default='pending', max_length=10),
        ),
        migrations.AlterModelTable(
            name='transaksi',
            table=None,
        ),
        migrations.CreateModel(
            name='Pembayaran',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('jenis_pembayaran', models.CharField(choices=[('dp', 'DP'), ('pelunasan', 'Pelunasan')], max_length=10)),
                ('nominal', models.FloatField()),
                ('metode_pembayaran', models.CharField(max_length=50)),
                ('status_pembayaran', models.CharField(choices=[('deny', 'Deny'), ('pending', 'Pending'), ('cancel', 'Cancel'), ('settlement', 'Settlement'), ('expired', 'Expired'), ('refund', 'Refund')], max_length=15)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('transaksi', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pembayaran', to='restoranApp.transaksi')),
            ],
        ),
    ]
