from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.CategoryListView.as_view(), name='category_list'),
    path('', views.ProductListView.as_view(), name='product_list'),
    path('<int:pk>/', views.ProductDetailView.as_view(), name='product_detail'),
    path('create/', views.ProductCreateView.as_view(), name='product_create'),
    path('my_products/', views.SellerProductsListView.as_view(), name='seller_products'),
]