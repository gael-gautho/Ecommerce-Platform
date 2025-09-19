from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from account.serializers import UserProfileSerializer
from .forms import EditProfileForm, SignupForm
from .models import User



@api_view(['GET'])
def get_profile(request):
    user = request.user 
    serializer = UserProfileSerializer(user, many = False)
    return JsonResponse(
        {"data": serializer.data},
    )


@api_view(['POST'])
def edit_profile(request):
    user = request.user

    form = EditProfileForm(request.data, instance=user)

    if form.is_valid():
        form.save()
    
        serializer = UserProfileSerializer(user)
        return JsonResponse({'message': 'information updated', 'user': serializer.data})

    else:
        message = form.errors
        return JsonResponse( {'message': message},
                            status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def signup(request):
    data = request.data
    message = 'success'

    form = SignupForm({
        'email': data.get('email'),
        'name': data.get('name'),
        'password1': data.get('password1'),
        'password2': data.get('password2'),
    })

    if form.is_valid():
        user = form.save()
        user.save()
        return JsonResponse(
            {"message": "success"},
            status=status.HTTP_201_CREATED, safe=False  
        )

    else:
        message = form.errors
        return JsonResponse( message,
                            status=status.HTTP_400_BAD_REQUEST, safe=False)
