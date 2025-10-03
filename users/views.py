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

        if user.user_type == 'seller':
            SellerProfile.objects.create(user=user)
        else:
            BuyerProfile.objects.create(user=user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
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