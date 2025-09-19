from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import api

urlpatterns = [
        path('edit_profile/', api.edit_profile, name='edit_profile'),
        path('get_profile/', api.get_profile, name='get_profile'),
        path('signup/', api.signup, name='signup'),
        path('login/', TokenObtainPairView.as_view(), name='token_obtain'),
        path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    ]