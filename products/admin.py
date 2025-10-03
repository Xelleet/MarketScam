from django.contrib import admin
from .models import Product, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'slug']
    list_editable = ['slug']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'name', 'seller', 'category', 'price',
        'stock', 'is_active', 'created_at'
    ]
    list_filter = ['category', 'is_active', 'created_at', 'seller']
    list_editable = ['price', 'stock', 'is_active']
    search_fields = ['name', 'description', 'seller__username']
    prepopulated_fields = {'slug': ('name',)} if hasattr(Product, 'slug') else {}
    readonly_fields = ['created_at', 'updated_at']

    # Фильтрация товаров по продавцу
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.user_type == 'seller':
            # Продавец видит только свои товары
            return qs.filter(seller=request.user)
        return qs

    # Автоматически устанавливаем продавца при создании товара
    def save_model(self, request, obj, form, change):
        if not change:  # Если это создание нового объекта
            obj.seller = request.user
        super().save_model(request, obj, form, change)