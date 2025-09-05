from django import forms
from .models import Product, ProductVariant, OtherImages


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ["name", "slug", "description", "main_image"]


class ProductVariantForm(forms.ModelForm):
    class Meta:
        model = ProductVariant
        fields = ["color", "size", "stock_quantity", "price", "discounted_price"]


class OtherImagesForm(forms.ModelForm):
    class Meta:
        model = OtherImages
        fields = ["image"]