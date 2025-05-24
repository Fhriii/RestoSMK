
from argparse import Action
from base64 import b64encode
from datetime import datetime
import json
import uuid

from django.http import JsonResponse
from rest_framework import viewsets,status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny , IsAuthenticated
from restoransmk import settings
from .serializer import *
from rest_framework.views import APIView
from .models import *
import requests
from django.views.decorators.csrf import csrf_exempt
import midtransclient
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum, Count, Case, When, Value, CharField




class LoginViewSet(viewsets.ViewSet):
    permission_classes=[AllowAny]

    def create(self,req):
        serializer = LoginSerializer(data=req.data)
        if serializer.is_valid():       
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        no_hp = request.data.get('no_hp')
        alamat = request.data.get('alamat')

        if CustomUser.objects.filter(email=email).exists():
            return Response({'error': 'Email sudah terdaftar'}, status=400)

        if CustomUser.objects.filter(username=username).exists():
            return Response({'error': 'Username sudah terdaftar'}, status=400)

        user = CustomUser.objects.create_user(
            username=username,
            email=email,
            no_hp=no_hp,
            alamat=alamat
        )
        user.set_password(password)
        user.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'status': user.status
            }
        })

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class MenuViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]        
    queryset=Menu.objects.all()
    serializer_class= MenuSerializer


class MejaViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]        
    queryset=Meja.objects.all()
    serializer_class= MejaSerializer

class UViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]        
    queryset=CustomUser.objects.all()
    serializer_class= UserSerializer



class TransaksiViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]    
    queryset=Transaksi.objects.all()
    serializer_class= TransaksiSerializer
    
class PembayaranViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]    
    queryset=Pembayaran.objects.all()
    serializer_class= PembayaranSerializer

class TransaksiDetailViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]    
    queryset=TransaksiDetail.objects.all()
    serializer_class= TransaksiDetailSerializer


@csrf_exempt
def buat_transaksi(request):
    if request.method == "POST":
        data = json.loads(request.body)

        try:
            id_user = data["id_user"]
            meja_id = data["meja_id"]
            nominal_dp = data["nominal_dp"]
            username = data.get("nama", "Pelanggan")
            email = data.get("email", "default@email.com")
            phone = data.get("phone", "08123456789")
        except KeyError:
            return JsonResponse({"error": "Data tidak lengkap"}, status=400)

        # Generate kode_booking unik
        kode_booking = f"BOOK-{uuid.uuid4().hex[:8].upper()}"

        # Simpan transaksi baru
        transaksi = Transaksi.objects.create(
            id_user=id_user,
            meja_id=meja_id,
            kode_booking=kode_booking,
            status_transaksi="pending"
        )

        # Buat Snap Token Midtrans
        snap = midtransclient.Snap(
            is_production=False,
            server_key=settings.MIDTRANS_SERVER_KEY
        )

        param = {
            "transaction_details": {
                "order_id": kode_booking,
                "gross_amount": int(nominal_dp)
            },
            "credit_card": {
                "secure": True
            },
            "customer_details": {
                "first_name": username,
                "email": email,
                "phone": phone
            },
            "callbacks": {
                "finish": "https://localhost:3000/pelanggan"
            }
        }

        try:
            midtrans_response = snap.create_transaction(param)
        except Exception as e:
            transaksi.delete()
            return JsonResponse({"error": str(e)}, status=500)

        # Simpan pembayaran awal (DP)
        Pembayaran.objects.create(
            transaksi=transaksi,
            jenis_pembayaran="dp",
            nominal=nominal_dp,
            metode_pembayaran="midtrans",
            status_pembayaran="pending"
        )

        return JsonResponse({
            "token": midtrans_response["token"],
            "redirect_url": midtrans_response["redirect_url"]
        })

    return JsonResponse({"error": "Invalid method"}, status=405)


@api_view(['GET'])
def top_5_menu_terlaris(request):
    queryset = (
        TransaksiDetail.objects
        .values('menu_id__nama_menu') 
        .annotate(total_dipesan=Sum('qty'))
        .order_by('-total_dipesan')[:5]
    )

    return Response({
        'success': True,
        'data': queryset,
        'message': 'Data top 5 menu berhasil diambil'
    })

@api_view(['GET'])
def total_pendapatan(request):
    start_date = "2025-04-11"
    end_date = "2025-04-12"
    try:

        start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date, '%Y-%m-%d').date()

        queryset = (
            Pembayaran.objects
            .filter(created_at__date__range=[start_date, end_date])
            .annotate(
                payment_status=Case(
                    When(status_pembayaran__in=['settlement', 'paid'], then=Value('Paid')),
                    When(status_pembayaran__in=['pending', 'unpaid'], then=Value('Unpaid')),
                    default=Value('Other'),
                    output_field=CharField(),
                )
            )
            .values('payment_status')
            .annotate(jumlah_transaksi=Count('id'))
            .order_by('payment_status')
        )

        return Response({
            'success': True,
            'data': queryset,
            'periode': f"{start_date} hingga {end_date}"
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=400)

@csrf_exempt
def midtrans_callback(request):
    if request.method == "POST":
        data = json.loads(request.body)

        order_id = data.get("order_id")
        transaction_status = data.get("transaction_status")
        payment_type = data.get("payment_type")
        gross_amount = float(data.get("gross_amount"))
        transaction_time = data.get("transaction_time")

        try:
            transaksi = Transaksi.objects.get(kode_booking=order_id)

            pembayaran = transaksi.pembayaran.filter(jenis_pembayaran="dp").first()
            if not pembayaran:
                return JsonResponse({"error": "Pembayaran tidak ditemukan"}, status=404)

            pembayaran.status_pembayaran = transaction_status
            pembayaran.metode_pembayaran = payment_type
            pembayaran.save()

            if transaction_status == "settlement":
                transaksi.status_transaksi = "reserved"
                transaksi.save()

            return JsonResponse({"message": "Callback berhasil diproses"}, status=200)

        except Transaksi.DoesNotExist:
            return JsonResponse({"error": "Transaksi tidak ditemukan"}, status=404)

    return JsonResponse({"error": "Invalid method"}, status=405)
