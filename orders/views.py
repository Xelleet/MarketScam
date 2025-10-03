from itertools import product

from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from products.models import Product

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'seller':
            return Order.objects.filter(seller=user)
        return Order.objects.filter(buyer=user)

class OrderDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = OrderSerializer
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'seller':
            return Order.objects.filter(seller=user)
        return Order.objects.filter(buyer=user)

@api_view(['POST'])
def create_order(request):
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity', 1)
    shipping_address = request.data.get('shipping_address')

    try:
        product = Product.objects.get(id=product_id, is_active=True)
        if product.stock < quantity:
            return Response({'error': 'Недостаточно товара на складе'}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(buyer=request.user, seller=product.seller, total_amount=product.price * quantity, shipping_address=shipping_address)
        OrderItem.objects.create(order=order, product=product, quantity=quantity, price=product.price)

        product.stock -= quantity

        product.save()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Product.DoesNotExist:
        return Response({'error': "Товар не найден"}, status=status.HTTP_404_NOT_FOUND)