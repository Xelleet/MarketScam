from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('register/profile/', views.register_profile, name='profile_register'),
    path('login/', obtain_auth_token, name='login'),
    path('profile/', views.UserProfileView.as_view(), name='user_profile'),
    path('profile/seller/', views.SellerProfileUpdateView.as_view(), name='seller_profile'),
    path('profile/buyer/', views.BuyerProfileUpdateView.as_view(), name='buyer_profile')
]