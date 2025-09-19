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
    order_items = OrderItemSerializer(many=True)


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
            "paid_amount",
            "order_items",
            "status",
            "created_at"
        )
    
    def create(self, validated_data):
        items_data = validated_data.pop('order_items')
        order = Order.objects.create(**validated_data)

        for item_data in items_data:
            # variant_id = item_data.pop('variant')
            # variant = ProductVariant.objects.get(id=variant_id)

            OrderItem.objects.create(order=order, **item_data)
            
        return order