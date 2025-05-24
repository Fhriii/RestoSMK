
from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.tokens import  RefreshToken
from django.contrib.auth import authenticate
from rest_framework.validators import UniqueValidator


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','username', 'email', 'status', 'password','no_hp','alamat']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("Email tidak ditemukan")

        if not user.check_password(password):
            raise serializers.ValidationError("Password salah")

        refresh = RefreshToken.for_user(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        }



class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=CustomUser.objects.all())]
            )

    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'password', 'email', 'no_hp', 'alamat')   

    def create(self, validated_data):
        user = CustomUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            no_hp=validated_data['no_hp'],
            alamat=validated_data['alamat']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user
class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = '__all__'

class TransaksiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaksi
        fields = '__all__'

class MejaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meja
        fields = '__all__'

class TransaksiDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransaksiDetail
        fields = '__all__'
        
class PembayaranSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pembayaran
        fields = '__all__'

