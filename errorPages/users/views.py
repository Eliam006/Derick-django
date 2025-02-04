from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from .forms import CustomUserCreationForm, CustomUserLoginForm
from django.contrib.auth.decorators import login_required

def register_view(request):
    if request.method == 'POST':  # Indentado correctamente
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)  # Iniciar sesión después del registro
            return redirect('home')  # Redirigir a la página principal
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})  # Indentado correctamente

def login_view(request):
    if request.method == 'POST':  # Indentado correctamente
        form = CustomUserLoginForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
    else:
        form = CustomUserLoginForm()
    return render(request, 'login.html', {'form': form})  # Indentado correctamente

def logout_view(request):
    logout(request)
    return redirect('login')  # Indentado correctamente

@login_required
def home_view(request):
    return render(request, 'home.html')
