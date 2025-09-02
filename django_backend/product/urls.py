from django.urls import path

from . import api 

urlpatterns = [
    path('get_productlist/', api.get_productlist, name='productlist'),
]