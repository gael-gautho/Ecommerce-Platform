from django.contrib import admin

from .models import Product, Category, ProductVariant, OtherImages

# Register your models here.

admin.site.register(Product)
admin.site.register(Category)
admin.site.register(ProductVariant)
admin.site.register(OtherImages)
