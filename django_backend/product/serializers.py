from rest_framework import serializers
from .models import Product


class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product 
        fields = ('id','name','slug', 'description', 'price' , 'main_image_url','other_image_urls' )