from django.db import models


from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'admin'),
        ('pelanggan', 'pelanggan'),
     
    )
    id = models.AutoField(primary_key=True)
    status = models.CharField(max_length=15, choices=ROLE_CHOICES,default="pelanggan")
    no_hp = models.CharField(unique=True, max_length=100,null=True)
    alamat = models.CharField( max_length=200,null=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True)
    
    class Meta:
        db_table = 'users'

class Meja(models.Model):
    MAYBECHOICE = (
        ('kosong', 'kosong'),
        ('dipesan', 'dipesan'),
        ('terisi', 'terisi'),
    )
    id_meja = models.AutoField(primary_key=True)
    no_meja = models.CharField(unique=True, max_length=100)
    kapasitas = models.IntegerField()
    status = models.CharField(max_length=10, choices=MAYBECHOICE,default="kosong")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'meja'

class Menu(models.Model):
    id_menu = models.AutoField(primary_key=True)
    nama_menu = models.CharField(max_length=50)
    harga = models.DecimalField(max_digits=10, decimal_places=0)
    stok = models.IntegerField()
    foto =  models.ImageField(upload_to="assets/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'menu'


from django.db import models

class Transaksi(models.Model):
    id_transaksi = models.AutoField(primary_key=True)
    id_user = models.ForeignKey(CustomUser,on_delete=models.CASCADE,db_column='id',null=True)  # idealnya FK ke model Pelanggan
    meja_id = models.ForeignKey(Meja,on_delete=(models.CASCADE),db_column='id_meja')    
    kode_booking = models.CharField(max_length=20, unique=True)
    tgl_jam_trx = models.DateTimeField(auto_now_add=True)

    STATUS_TRANSAKSI_CHOICES = [
        ('pending', 'Pending'),
        ('reserved', 'Reserved'),
        ('checkin', 'Check-in'),
        ('done', 'Done'),
        ('failed', 'Failed'),
    ]
    status_transaksi = models.CharField(
        max_length=10,
        choices=STATUS_TRANSAKSI_CHOICES,
        default='pending'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transaksi {self.kode_booking}"


class Pembayaran(models.Model):
    transaksi = models.ForeignKey(Transaksi, on_delete=models.CASCADE, related_name="pembayaran")

    JENIS_PEMBAYARAN_CHOICES = [
        ('dp', 'DP'),
        ('pelunasan', 'Pelunasan'),
    ]
    jenis_pembayaran = models.CharField(max_length=10, choices=JENIS_PEMBAYARAN_CHOICES)

    nominal = models.FloatField()
    metode_pembayaran = models.CharField(max_length=50)

    STATUS_PEMBAYARAN_CHOICES = [
        ('deny', 'Deny'),
        ('pending', 'Pending'),
        ('cancel', 'Cancel'),
        ('settlement', 'Settlement'),
        ('expired', 'Expired'),
        ('refund', 'Refund'),
    ]
    status_pembayaran = models.CharField(max_length=15, choices=STATUS_PEMBAYARAN_CHOICES)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.jenis_pembayaran.title()} - {self.transaksi.kode_booking}"




class TransaksiDetail(models.Model):
    id_detail = models.AutoField(primary_key=True)
    transaksi_id = models.ForeignKey(Transaksi, on_delete=(models.CASCADE), db_column='id_transaksi', blank=True, null=True)
    menu_id = models.ForeignKey(Menu, on_delete=(models.CASCADE), db_column='id_menu', blank=True, null=True)
    qty =  models.IntegerField()
    harga = models.DecimalField(max_digits=10, decimal_places=0, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'detail_transaksi'


class PaymentLog(models.Model):
    id_log = models.AutoField(primary_key=True)
    order_id = models.CharField(unique=True,max_length=100)