from rest_framework import serializers
from .models import Product, ProductVariant


class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product 
        fields = ('id','name','slug','discounted_price', 'description', 'price' , 'main_image_url','other_images_urls' )


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant 
        fields = ('id','color', 'size', 'stock_quantity' , 'price_override' )


class ProductDetailSerializer(serializers.ModelSerializer):
    product_variant = ProductVariantSerializer(read_only=True, many=True)

    class Meta:
        model = Product 
        fields = ('id','name','slug', 'description', 'price' , 'main_image_url','other_images_urls',
                  'color_options','size_options','total_stock','discounted_price','product_variant' )


