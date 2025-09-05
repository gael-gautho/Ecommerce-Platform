from django.urls import path

from . import api 

urlpatterns = [
    path('get_productlist/', api.get_productlist, name='productlist'),
    path('get_categories/', api.get_categories, name='categories'),
    path('get_productdetail/<str:slug>', api.get_productdetail, name='productdetail'),
    path('create_product/', api.create_product, name='createproduct'),
    
    ]