from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator

User = get_user_model()

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return f'Name: {self.name}'

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    evaluation = models.PositiveIntegerField(validators=[MaxValueValidator(5)])
    text = models.TextField(blank=True, null=True)

class Product(models.Model):
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    reviews = models.ForeignKey(Review, on_delete=models.CASCADE, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, validators=[MaxValueValidator(5)], default=0)
    image = models.ImageField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Name: {self.name}"