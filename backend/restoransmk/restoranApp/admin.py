from django.contrib import admin

from .models import *

admin.site.register(Menu)
admin.site.register(Meja)
admin.site.register(CustomUser)
admin.site.register(Transaksi)
admin.site.register(TransaksiDetail)
admin.site.register(Pembayaran)