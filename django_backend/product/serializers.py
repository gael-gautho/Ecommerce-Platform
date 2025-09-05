from rest_framework import serializers
from .models import Category, Product, ProductVariant


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category 
        fields = ('id','name','slug','image_url')


class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product 
        fields = ('id','category','name','slug','lower_price', 'description', 'main_image_url','other_images_urls' )


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant 
        fields = ('id','color', 'size', 'stock_quantity' , 'price', 'discounted_price' )


class ProductDetailSerializer(serializers.ModelSerializer):
    product_variant = ProductVariantSerializer(read_only=True, many=True)

    class Meta:
        model = Product 
        fields = ('id','category','name','slug', 'description' , 'main_image_url','other_images_urls',
                  'color_options','size_options','total_stock','product_variant' )



