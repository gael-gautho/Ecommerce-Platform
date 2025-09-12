from rest_framework import serializers

from product.models import ProductVariant
from .models import Order, OrderItem
from product.serializers import ProductVariantSerializer

class MyOrderItemSerializer(serializers.ModelSerializer):    
    product_variant = ProductVariantSerializer()

    class Meta:
        model = OrderItem
        fields = (
            "price",
            "product_variant",
            "quantity",
        )

class MyOrderSerializer(serializers.ModelSerializer):
    items = MyOrderItemSerializer(many=True)

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
            "items",
            "paid_amount"
        )

class OrderItemSerializer(serializers.ModelSerializer):    
    
    #variant = ProductVariantSerializer()

    class Meta:
        model = OrderItem
        fields = (
            "item_subtotal",
            "variant",
            "quantity",
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
            "order_items",
        )
    
    def create(self, validated_data):
        items_data = validated_data.pop('order_items')
        order = Order.objects.create(**validated_data)

        for item_data in items_data:
            # variant_id = item_data.pop('variant')
            # variant = ProductVariant.objects.get(id=variant_id)

            OrderItem.objects.create(order=order, **item_data)
            
        return order