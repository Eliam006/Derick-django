from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser
from django.contrib.auth.forms import AuthenticationForm

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ['email', 'name', 'surname', 'control_number', 'age', 'tel', 'password1', 'password2']

"""
        widgets = {
            'email': forms.EmailInput(
                attrs={
                    'class': 'form-control',
                    'placeholder': 'Correo electrónico',
                    'required': True,
                    'pattern': r'^[a-zA-Z0-9]+@utez\.edu\.mx$',
                    'title': "Lo siento, el formato no es correcto. Usa el dominio @utez.edu.mx"
                }
            ),
            'name': forms.TextInput(
                attrs={
                    'class': 'form-control',
                    'required': True,
                    'minlength': '3',
                    'maxlength': '50',  
                    'title': "Por favor, ingresa tu nombre. Mínimo 3 caracteres."
                }
            ),
            'surname': forms.TextInput(
                attrs={
                    'class': 'form-control',
                    'required': True,
                    'minlength': '3',
                    'maxlength': '50',
                    'title': "Por favor, ingresa tu apellido. Mínimo 3 caracteres."
                }
            ),
            'control_number': forms.TextInput(
                attrs={
                    'class': 'form-control',
                    'required': True,
                    'pattern': r'^\d{5}[a-zA-Z]{2}\d{3}$',
                    'title': "Lo siento, el formato no es correcto."
                }
            ),
            'age': forms.NumberInput(
                attrs={
                    'class': 'form-control',
                    'required': True,
                    'min': '18',
                    'max': '100',
                    'title': "Por favor, ingresa tu edad entre 18 y 100 años."
                }
            ),
            'tel': forms.TextInput(
                attrs={
                    'class': 'form-control',
                    'required': True,
                    'minlength': '5',
                    'maxlength': '10',
                    'pattern': r'^\+?1?\d{10}$', 
                    'title': "El número de teléfono debe tener 10 digitos."
                }
            ),
            'password1': forms.PasswordInput(
                attrs={
                    'class': 'form-control',
                    'required': True,
                    'minlength': '8',
                    'pattern': r'^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$',
                    'title': "La contraseña debe tener al menos 8 caracteres."
                }
            ),
            'password2': forms.PasswordInput(
                attrs={
                    'class': 'form-control',
                    'required': True,
                    'minlength': '8',
                    'pattern': r'^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$',
                    'title': "Por favor, confirma tu contraseña."
                }
            ),
        }
        """

class CustomUserLoginForm(AuthenticationForm):
    pass
