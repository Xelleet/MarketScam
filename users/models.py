from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('seller', 'Продавец'),
        ('buyer', 'Покупатель'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='buyer')
    phone = models.CharField(max_length=20, blank=True)

    # Указываем related_name для избежания конфликта
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',  # или 'users_groups'
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions_set',  # или 'users_permissions'
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"


class SellerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='seller_profile')
    company_name = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"Профиль продавца: {self.user.username}"


class BuyerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='buyer_profile')
    address = models.TextField(blank=True)
    delivery_preferences = models.TextField(blank=True)

    def __str__(self):
        return f"Профиль покупателя: {self.user.username}"