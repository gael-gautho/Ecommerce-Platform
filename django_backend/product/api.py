from rest_framework.decorators import api_view, authentication_classes, permission_classes
from datetime import timedelta
from .serializers import ProductListSerializer
from django.http import JsonResponse
from .models import Product
from django.db.models import Exists, OuterRef



@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def get_productlist(request):

    productList = Product.objects.all()
    serializer = ProductListSerializer(productList, many = True)

    return JsonResponse(
        {"data": serializer.data},
    )

