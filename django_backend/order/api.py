from django.http import JsonResponse
import stripe

from django.conf import settings
from django.db import transaction
from rest_framework.exceptions import ValidationError
from rest_framework import status, authentication, permissions
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response

from .models import Order, OrderItem
from product.models import Cart
from .serializers import OrderSerializer, MyOrderSerializer


@api_view(['POST'])
def checkout(request):
    try:
        cart = Cart.objects.get(user=request.user)
        cart_items = cart.cartItems.all()

        if not cart_items.exists():
            return Response({"error": "Your cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = OrderSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            total_paid_amount = 0
            items_to_process = []

            for item in cart_items:
                variant = item.variant
                variant_in_db = variant.__class__.objects.select_for_update().get(pk=variant.pk)
                
                if variant_in_db.stock_quantity < item.quantity:
                    raise ValidationError(f"Insufficient stock for {variant.product.name}. Available: {variant_in_db.stock_quantity}")

                total_paid_amount += item.item_subtotal()
                items_to_process.append({
                    'variant': variant_in_db,
                    'quantity': item.quantity,
                    'item_subtotal': item.item_subtotal()
                })

            order = serializer.save(
                user=request.user,
                paid_amount=total_paid_amount,
            )

            for proc_item in items_to_process:
                OrderItem.objects.create(
                    order=order,
                    variant=proc_item['variant'],
                    quantity=proc_item['quantity'],
                    item_subtotal=proc_item['item_subtotal']
                )
                proc_item['variant'].stock_quantity -= proc_item['quantity']
                proc_item['variant'].save()

            cart.delete()

        try:
            stripe.api_key = settings.STRIPE_SECRET_KEY
            charge = stripe.Charge.create(
                amount=int(total_paid_amount * 100),
                currency='USD',
                description=f'Order #{order.id}',
                source=serializer.validated_data['stripe_token']
            )
        except stripe.error.StripeError as e:
            order.status = 'Payment Failed'
            order.save()
            return Response({"error": f"Payment failed: {e}"}, status=status.HTTP_400_BAD_REQUEST)

        final_serializer = OrderSerializer(order)
        return Response(final_serializer.data, status=status.HTTP_201_CREATED)

    except Cart.DoesNotExist:
        return Response({"error": "No cart found for this user."}, status=status.HTTP_404_NOT_FOUND)
    except ValidationError as e:
        return Response({"error": e.detail}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_myorders(request):
    orders = Order.objects.filter(user=request.user)
    serializer = MyOrderSerializer(orders, many=True)
    return JsonResponse({"data":serializer.data})
