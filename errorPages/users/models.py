from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator, MinLengthValidator, MaxLengthValidator, RegexValidator
from django.db import models
from django.utils.timezone import now

# Validadores personalizados
def validate_utez_email(value):
    if not value.endswith('@utez.edu.mx'):
        raise ValidationError('El correo debe ser del dominio @utez.edu.mx')

def validate_control_number(value):
    if not RegexValidator(r'^\d{5}[a-zA-Z]{2}\d{3}$')(value):
        raise ValidationError('El número de control debe tener el formato: 5 números, 2 letras y 3 números (Ejemplo: 20223TN006)')

def validate_phone_number(value):
    if not value.isdigit() or len(value) != 10:
        raise ValidationError('El teléfono debe contener exactamente 10 dígitos')

def validate_password_format(value):
    if not RegexValidator(r'^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$')(value):
        raise ValidationError('La contraseña debe tener al menos 8 caracteres, incluyendo 1 número, 1 letra mayúscula y 1 carácter especial')

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El correo electrónico es obligatorio')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.full_clean()  # Ejecutar validaciones antes de guardar
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, validators=[validate_utez_email])
    token = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=100, validators=[MinLengthValidator(2), MaxLengthValidator(100)])
    surname = models.CharField(max_length=100, validators=[MinLengthValidator(2), MaxLengthValidator(100)])
    control_number = models.CharField(max_length=20, unique=True, validators=[validate_control_number])
    age = models.PositiveIntegerField()
    tel = models.CharField(max_length=10, validators=[validate_phone_number])
    join_date = models.DateTimeField(default=now)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'surname', 'control_number', 'age', 'tel']

    def clean(self):
        super().clean()
        if self.password:
            validate_password_format(self.password)

    def __str__(self):
        return self.email