from django.http import JsonResponse
import stripe

from django.conf import settings

from rest_framework import status, authentication, permissions
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response

from .models import Order, OrderItem
from .serializers import OrderSerializer, MyOrderSerializer


@api_view(['POST'])
def checkout(request):
    serializer = OrderSerializer(data=request.data)

    if serializer.is_valid():
        stripe.api_key = settings.STRIPE_SECRET_KEY
        paid_amount = sum(item.get('item_subtotal') for item in serializer.validated_data['order_items'])

        # try:
        charge = stripe.Charge.create(
            amount=int(paid_amount * 100),
            currency='USD',
            description='Charge from Letshop',
            source=serializer.validated_data['stripe_token']
        )

        serializer.save(user=request.user, paid_amount=paid_amount)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
        # except Exception as e:
            # print(e)
            # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_myorders(request):
    orders = Order.objects.filter(user=request.user)
    serializer = MyOrderSerializer(orders, many=True)
    return JsonResponse({"data":serializer.data})
