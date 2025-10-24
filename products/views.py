from django.contrib.auth import get_user_model
from django.template.context_processors import request
from rest_framework import generics, filters
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework import generics, status


from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from rest_framework.decorators import api_view, permission_classes

User = get_user_model()

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class SellerProductsListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user)

class ProductListView(generics.ListCreateAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'seller']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at']
    ordering = ['-created_at']

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def perform_update(self, serializer):
        if self.get_object().seller == self.request.user:
            serializer.save()

    def perform_destroy(self, instance):
        if instance.seller == self.request.user:
            instance.is_active = False
            instance.save()

class ProductCreateView(generics.CreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(seller=user)