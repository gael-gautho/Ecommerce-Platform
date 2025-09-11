from django.urls import path

from . import api 

urlpatterns = [
    path('get_productlist/', api.get_productlist, name='productlist'),
    path('get_categories/', api.get_categories, name='categories'),
    path('get_productdetail/<str:slug>', api.get_productdetail, name='productdetail'),
    path('create_product/', api.create_product, name='createproduct'),
    path('add_to_cart/', api.add_to_cart, name='add_to_cart'),
    path('get_cartitems/', api.get_cartitems, name='cartitems'),
    path('update_cartitem/<str:pk>/', api.update_cartitem, name='update_cartitem'),    
    path('delete_cartitem/<str:pk>/', api.delete_cartitem, name='delete_cartitem'),    
    ]   