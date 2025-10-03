from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import SellerProfile, BuyerProfile

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'user_type', 'phone', 'password']
        # Исключаем пароль из вывода
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Извлекаем пароль из validated_data
        password = validated_data.pop('password')
        # Создаем пользователя
        user = User(**validated_data)
        # Устанавливаем зашифрованный пароль
        user.set_password(password)
        user.save()
        return user


class SellerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerProfile
        fields = ['id', 'company_name', 'description', 'rating', 'is_verified']
        read_only_fields = ['id', 'rating']


class BuyerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyerProfile
        fields = ['id', 'address', 'delivery_preferences']
        read_only_fields = ['id']


class UserProfileSerializer(serializers.ModelSerializer):
    seller_profile = SellerProfileSerializer(read_only=True)
    buyer_profile = BuyerProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'user_type', 'phone', 'seller_profile', 'buyer_profile']