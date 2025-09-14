from django.urls import path

from order import api

urlpatterns = [
    path('checkout/', api.checkout),
    path('get_myorders/', api.get_myorders),  
]