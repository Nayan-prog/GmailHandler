from django.contrib import admin
from django.urls import path
from users.views import google_login, google_callback, get_emails_from_db

urlpatterns = [
    path('admin/', admin.site.urls),

    path('auth/login/', google_login),
    path('auth/callback/', google_callback),
     path('api/emails/', get_emails_from_db),
]