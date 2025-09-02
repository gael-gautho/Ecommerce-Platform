import uuid
from django.conf import settings
from django.db import models

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField()

    class Meta:
        ordering = ('name',)
    
    def __str__(self):
        return self.name
    

class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE, null=True, blank=True)    
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    main_image = models.ImageField(upload_to="products/")
    is_featured = models.BooleanField(default=False)    
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
    

class ProductVariant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    color = models.CharField(max_length=50, blank=True, null=True)
    size = models.CharField(max_length=20, blank=True, null=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    price_override = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)


class OtherImages(models.Model):
    product = models.ForeignKey(Product, related_name="other_images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="products/")

    