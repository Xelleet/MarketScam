from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'buyer', 'seller', 'total_amount',
        'status', 'created_at'
    ]
    list_filter = ['status', 'created_at', 'buyer', 'seller']
    search_fields = ['buyer__username', 'seller__username']
    inlines = [OrderItemInline]
    readonly_fields = ['created_at', 'updated_at']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.user_type == 'seller':
            # Продавец видит только свои заказы
            return qs.filter(seller=request.user)
        elif request.user.user_type == 'buyer':
            # Покупатель видит только свои заказы
            return qs.filter(buyer=request.user)
        return qs