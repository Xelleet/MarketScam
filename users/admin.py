from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model
from .models import SellerProfile, BuyerProfile

User = get_user_model()


# Регистрируем профили продавцов и покупателей
@admin.register(SellerProfile)
class SellerProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'company_name', 'rating', 'is_verified']
    list_filter = ['is_verified']
    search_fields = ['user__username', 'company_name']


@admin.register(BuyerProfile)
class BuyerProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'address']
    search_fields = ['user__username', 'address']


# Настройка кастомного UserAdmin
class SellerProfileInline(admin.StackedInline):
    model = SellerProfile
    can_delete = False
    verbose_name_plural = 'Профиль продавца'


class BuyerProfileInline(admin.StackedInline):
    model = BuyerProfile
    can_delete = False
    verbose_name_plural = 'Профиль покупателя'


class CustomUserAdmin(UserAdmin):
    # Добавляем встроенные формы профилей
    inlines = (SellerProfileInline, BuyerProfileInline)

    # Добавляем поле user_type в список отображения
    list_display = UserAdmin.list_display + ('user_type', 'phone')

    # Добавляем поля в форму редактирования
    fieldsets = UserAdmin.fieldsets + (
        ('Дополнительная информация', {
            'fields': ('user_type', 'phone')
        }),
    )

    # Добавляем поля в форму создания пользователя
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Дополнительная информация', {
            'fields': ('user_type', 'phone')
        }),
    )


# УДАЛИТЕ ЭТУ СТРОКУ:
# admin.site.unregister(User)

# Регистрируем нашу кастомную модель
admin.site.register(User, CustomUserAdmin)