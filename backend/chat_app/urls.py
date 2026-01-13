from django.urls import path
from . import views

urlpatterns = [
    path('messages/', views.chat_view, name='chat_view'),
]
