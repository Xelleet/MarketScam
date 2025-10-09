from multiprocessing.connection import deliver_challenge

from django.core.serializers import serialize
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from .models import SellerProfile, BuyerProfile
from .serializers import UserSerializer, SellerProfileSerializer, BuyerProfileSerializer

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(request.data['password'])
        user.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def register_profile(request):
    if request.data['type'] == 'buyer':
        serializer = BuyerProfileSerializer(data=request.data)
    elif request.data['type'] == 'seller':
        serializer = SellerProfileSerializer(data=request.data)
    else:
        return Response({'error': 'Invalid profile type'}, status=status.HTTP_400_BAD_REQUEST)

    if serializer.is_valid():
        if request.data['type'] == 'buyer':
            BuyerProfile.objects.update_or_create(user=request.user, address=request.data['address'], delivery_preferences=request.data['delivery_preferences'])
        else:
            SellerProfile.objects.update(user=request.user, company_name=request.data['company_name'], description=request.data['description']) #ToDo: доделать нормальные аргументы
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class BuyerProfileUpdateView(generics.UpdateAPIView):
    serializer_class = BuyerProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, created = BuyerProfile.objects.get_or_create(user=self.request.user)
        return profile


class SellerProfileUpdateView(generics.UpdateAPIView):
    serializer_class = SellerProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, created = SellerProfile.objects.get_or_create(user=self.request.user)
        return profile