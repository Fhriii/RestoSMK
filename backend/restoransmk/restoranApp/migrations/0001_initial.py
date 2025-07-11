# Generated by Django 5.2 on 2025-04-10 03:49

import django.contrib.auth.models
import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Meja',
            fields=[
                ('id_meja', models.AutoField(primary_key=True, serialize=False)),
                ('no_meja', models.CharField(max_length=100, unique=True)),
                ('kapasitas', models.IntegerField()),
                ('image_meja', models.ImageField(blank=True, null=True, upload_to='assets/meja/')),
                ('status', models.CharField(choices=[('Booked', 'Booked'), ('Avaliable', 'Avaliable')], max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'meja',
            },
        ),
        migrations.CreateModel(
            name='Menu',
            fields=[
                ('id_menu', models.AutoField(primary_key=True, serialize=False)),
                ('nama_menu', models.CharField(max_length=50)),
                ('harga', models.DecimalField(decimal_places=0, max_digits=10)),
                ('stok', models.IntegerField()),
                ('foto', models.ImageField(blank=True, null=True, upload_to='assets/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'menu',
            },
        ),
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('role', models.CharField(choices=[('admin', 'Admin'), ('pelanggan', 'Pelanggan')], max_length=15)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Transaksi',
            fields=[
                ('id_transaksi', models.AutoField(primary_key=True, serialize=False)),
                ('kode_booking', models.CharField(max_length=20, unique=True)),
                ('tgl_jam_trx', models.DateTimeField(auto_now_add=True)),
                ('status_transaksi', models.CharField(choices=[('pending', 'pending'), ('reserved', 'reserved'), ('checkin', 'checkin'), ('done', 'done'), ('failed', 'failed')], max_length=20)),
                ('nominal_dp', models.DecimalField(blank=True, decimal_places=0, max_digits=20, null=True)),
                ('metode_pembayaran', models.CharField(choices=[('pending', 'pending'), ('deny', 'deny'), ('cancel', 'cancel'), ('settlement', 'settlement'), ('expired', 'expired'), ('refund', 'refund')], max_length=20)),
                ('total_bayar', models.DecimalField(blank=True, decimal_places=0, max_digits=10, null=True)),
                ('kekurangan', models.DecimalField(blank=True, decimal_places=0, max_digits=20, null=True)),
                ('metode_pembayaran_trx', models.CharField(blank=True, max_length=50, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('id_user', models.ForeignKey(db_column='id', null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('meja_id', models.ForeignKey(db_column='id_meja', on_delete=django.db.models.deletion.DO_NOTHING, to='restoranApp.meja')),
            ],
            options={
                'db_table': 'transaksi',
            },
        ),
        migrations.CreateModel(
            name='TransaksiDetail',
            fields=[
                ('id_detail', models.AutoField(primary_key=True, serialize=False)),
                ('qty', models.IntegerField()),
                ('harga', models.DecimalField(blank=True, decimal_places=0, max_digits=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('menu_id', models.ForeignKey(blank=True, db_column='id_menu', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='restoranApp.menu')),
                ('transaksi_id', models.ForeignKey(blank=True, db_column='id_transaksi', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='restoranApp.transaksi')),
            ],
            options={
                'db_table': 'detail_transaksi',
            },
        ),
    ]
