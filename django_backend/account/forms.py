from django.contrib.auth.forms import UserCreationForm
from django import forms

from .models import User


class SignupForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('email', 'fullname', 'password1', 'password2')


class EditProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('fullname', 'phone_number','address')