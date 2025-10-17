from rest_framework import serializers
from .models import Product, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'stock', 'image',
            'is_active', 'created_at', 'seller', 'seller_name', # seller_name теперь включено
            'category', 'category_name' # category_name теперь включено
        ]
        read_only_fields = ['id', 'created_at', 'seller_name', 'category_name']