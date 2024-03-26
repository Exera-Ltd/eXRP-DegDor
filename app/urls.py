from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import RedirectView
from django.contrib.auth.views import LoginView, LogoutView
from django.conf import settings
from django.conf.urls.static import static
from dashboard import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('dashboard/', include('dashboard.urls')),
    path('', RedirectView.as_view(url='dashboard/')),
    path('accounts/login/', LoginView.as_view(redirect_authenticated_user=True), name='login'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('users/', include('users.urls')),
    path('app_config/', include('app_config.urls')),
    path('log/', include('log.urls')),
    re_path(r'^(?!dashboard/).*$', RedirectView.as_view(url='dashboard/')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

admin.site.site_header = "eXRP Admin"
admin.site.site_title = "eXRP Admin Portal"
admin.site.index_title = "Welcome to eXRP Admin Portal"