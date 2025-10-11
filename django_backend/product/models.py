import uuid
from django.conf import settings
from django.db import models
from django.db.models import Min

from account.models import User

# Create your models here.

class Category(models.Model):

    Name_choices = [
    ("Accessories", "Accessories"),
    ("Hoodies", "Hoodies"),
    ("Jackets", "Jackets"),
    ("Jeans", "Jeans"),
    ("Sneakers", "Sneakers"),
    ("T-shirt", "T-shirt"), 
    ]
    
    Slug_choices = [
    ("accessories", "accessories"),
    ("hoodies", "hoodies"),
    ("jackets", "jackets"),
    ("jeans", "jeans"),
    ("sneakers", "sneakers"),
    ("t-shirt", "t-shirt"), 
    ]


    name = models.CharField(max_length=255, choices=Name_choices)
    slug = models.SlugField(choices=Slug_choices)
    image = models.ImageField(upload_to="categories/", blank=True, null= True)

    class Meta:
        ordering = ('name',)
    
    def __str__(self):
        return self.name
    
    @property
    def image_url(self):
        if self.image:
            return settings.WEBSITE_URL + self.image.url 

    

class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE, null=True, blank=True)    
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    main_image = models.ImageField(upload_to="products/")
    is_featured = models.BooleanField(default=False)    
    total_stock = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
    @property
    def main_image_url(self):
        if self.main_image:
            return settings.WEBSITE_URL + self.main_image.url 
    
    @property
    def other_images_urls(self):
        return [settings.WEBSITE_URL + img.image.url for img in self.other_images.all()]
    
    @property
    def color_options(self):
        return list(
            self.product_variant.exclude(color__isnull=True).exclude(color__exact="")
            .values_list("color", flat=True)
            .distinct()
        )

    @property
    def size_options(self):
        return list(
            self.product_variant.exclude(size__isnull=True).exclude(size__exact="")
            .values_list("size", flat=True)
            .distinct()
        )

    @property
    def lower_price(self):
        min_price = self.product_variant.aggregate(
            min_price=Min('discounted_price')
        )['min_price']
        return min_price


class ProductVariant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="product_variant")
    color = models.CharField(max_length=50, blank=True, null=True)
    size = models.CharField(max_length=20, blank=True, null=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    @property
    def product_image_url(self):
        if self.product.main_image:
            return settings.WEBSITE_URL + self.product.main_image.url 

    @property
    def product_name(self):
        return self.product.name 



class OtherImages(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)    
    product = models.ForeignKey(Product, related_name="other_images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="products/")


class Cart(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)    
    user = models.ForeignKey( User, on_delete=models.CASCADE, null=True, blank=True )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def total_items(self):
        return sum(item.quantity for item in self.cartItems.all())

    def cart_subtotal(self):
        return sum(item.item_subtotal() for item in self.cartItems.all())


class CartItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)        
    cart = models.ForeignKey(Cart, related_name="cartItems", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)

    def unit_price(self):
        return self.variant.discounted_price 

    def item_subtotal(self):
        return self.unit_price() * self.quantity