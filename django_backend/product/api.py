import json
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from datetime import timedelta

from .forms import OtherImagesForm, ProductForm, ProductVariantForm
from .serializers import ProductDetailSerializer, ProductListSerializer
from django.http import JsonResponse
from .models import Category, OtherImages, Product, ProductVariant
from django.db.models import Exists, OuterRef
from rest_framework import status



@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def get_productlist(request):

    productList = Product.objects.all()
    serializer = ProductListSerializer(productList, many = True)

    return JsonResponse(
        {"data": serializer.data},
    )



@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def get_productdetail(request, slug):

    product = Product.objects.get(slug = slug)
    serializer = ProductDetailSerializer(product, many = False)

    return JsonResponse(
        {"data": serializer.data},
    )


@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def create_product(request):

    product_form = ProductForm(request.POST, request.FILES)
    
    if product_form.is_valid():
        product = product_form.save(commit=False)
        product.category = Category.objects.get(name=request.POST["category"])
        product.save()
    
        variants = json.loads(request.POST.get("product_variant", "[]"))
        for v in variants:
            ProductVariant.objects.create(
                product=product,
                color=v["color"],
                size=v["size"],
                stock_quantity=v["stock_quantity"],
                price=v["price"],
                discounted_price=v["discounted_price"]
            )

        # Save other images
        for img in request.FILES.getlist("other_images"):
            OtherImages.objects.create(product=product, image=img)

        return JsonResponse({'status': 'created'})
    
    else:
        message = product_form.errors
        return JsonResponse( message,
                            status=status.HTTP_400_BAD_REQUEST, safe=False)
