
from rest_framework.routers import DefaultRouter
from .views import *
from django.urls import path,include
from django.views.decorators.csrf import csrf_exempt

from . import views


router = DefaultRouter()
router.register(r'login',LoginViewSet,basename='login') 
router.register(r'menu',MenuViewSet,basename='menu')
router.register(r'transaksi',TransaksiViewSet,basename='transaksi')
router.register(r'meja',MejaViewSet,basename ='meja')
router.register(r'user',UViewSet,basename ='user')
router.register(r'transaksidetail',TransaksiDetailViewSet,basename ='transaksidetail')

urlpatterns = [
    path('',include(router.urls)),
    path('bayar/', buat_transaksi,name='bayar'),
    path('registrasi/', register,name='registrasi'),
    path('terlaris/', top_5_menu_terlaris,name='terlaris'),
    path('total/', total_pendapatan,name='total'),
    path('midtrans-callback/', views.midtrans_callback),

]