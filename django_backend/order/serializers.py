from rest_framework import serializers

from product.models import ProductVariant
from .models import Order, OrderItem
from product.serializers import ProductVariantSerializer

class MyOrderItemSerializer(serializers.ModelSerializer):    
    variant = ProductVariantSerializer()
    order_id = serializers.UUIDField(source='order.id', read_only=True)


    class Meta:
        model = OrderItem
        fields = (
            "item_subtotal",
            "variant",
            "quantity",
            'order_id'
        )

class MyOrderSerializer(serializers.ModelSerializer):
    order_items = MyOrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "address",
            "zipcode",
            "place",
            "phone",
            "stripe_token",
            "order_items",
            "paid_amount",
            "status",
            "created_at"

        )

class OrderItemSerializer(serializers.ModelSerializer):    
    
    #variant = ProductVariantSerializer()
    order_id = serializers.UUIDField(source='order.id', read_only=True)


    class Meta:
        model = OrderItem
        fields = (
            "item_subtotal",
            "variant",
            "quantity",
            'order_id'
        )

class OrderSerializer(serializers.ModelSerializer):
    # On garde order_items en read_only pour l'afficher dans la réponse finale
    order_items = OrderItemSerializer(many=True, read_only=True)
    # On s'attend à ce que le user soit défini dans la vue, donc read_only
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Order
        fields = (
            "id",
            "user", # Ajouté pour la réponse
            "first_name",
            "last_name",
            "email",
            "address",
            "zipcode",
            "place",
            "phone",
            "stripe_token",
            "paid_amount",
            "order_items",
            "status",
            "created_at"
        )
        read_only_fields = ('paid_amount', 'status', 'created_at', 'id', 'user')
        # stripe_token est obligatoire pour la création mais on ne veut pas le renvoyer
        extra_kwargs = {
            'stripe_token': {'write_only': True}
        }