import json
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from datetime import timedelta

from .forms import OtherImagesForm, ProductForm, ProductVariantForm
from .serializers import CartItemSerializer, CategorySerializer, ProductDetailSerializer, ProductListSerializer
from django.http import JsonResponse
from .models import Cart, CartItem, Category, OtherImages, Product, ProductVariant
from django.db.models import Min, Exists, OuterRef
from rest_framework import status
from django.core.paginator import Paginator


@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def get_categories(request):

    category = Category.objects.all()
    serializer = CategorySerializer(category, many = True)

    return JsonResponse(
        {"data": serializer.data},
    )


@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def get_productlist(request):

    number_of_products = int(request.GET.get('number_of_products', 10))
    is_featured = request.GET.get('is_featured', '')
    category = request.GET.get('category', '')
    name = request.GET.get('name', '')
    min_price = float(request.GET.get("min", 0))
    max_price = float(request.GET.get("max", 999999))
    sort = request.GET.get("sort", "asc price")
    page_number = request.GET.get("page", 1)
    

    productList = Product.objects.all()

    if is_featured:
        productList = productList.filter(is_featured=True)

    if category:
        productList = productList.filter(category__slug=category)
    
    if name:
        productList = productList.filter(name__icontains=name)

    productList = productList.annotate(
                lower_price_anno=Min("product_variant__discounted_price")
                ).filter( lower_price_anno__gte=min_price, lower_price_anno__lte=max_price )
    
    if sort == "asc price":
        productList = productList.order_by("lower_price_anno")
    elif sort == "desc price":
        productList = productList.order_by("-lower_price_anno")

    paginator = Paginator(productList, number_of_products)  
    page_obj = paginator.get_page(page_number)

    serializer = ProductListSerializer(page_obj, many = True)


    return JsonResponse(
        {"data": serializer.data,
         "has_next": page_obj.has_next(),
         "has_previous": page_obj.has_previous()
         }
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


@api_view(['POST'])
def add_to_cart(request):

    variant_id = request.data.get("variantId")
    variant = ProductVariant.objects.get(id=variant_id)
    incoming_quantity = request.data.get("quantity")

    cart, _= Cart.objects.get_or_create(user=request.user)
    cart_item, created = CartItem.objects.get_or_create(variant=variant, cart=cart)

    if created:
        cart_item.quantity = incoming_quantity
        message = 'Article ajouté au panier'
    else:
        cart_item.quantity += incoming_quantity
        message = 'La quantité a été mise à jour dans votre panier'

    cart_item.save()
    all_items = CartItem.objects.all()
    serializer = CartItemSerializer(all_items, many = True)

    return JsonResponse({'status': 'Added',
                         'data': serializer.data
                         })