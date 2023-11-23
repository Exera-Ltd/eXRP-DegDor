from django.urls import include, re_path, path
from django.conf import settings
from django.contrib.auth.views import LogoutView
from users import views

user_urls = [
	path("get_user", views.get_user)
]

urlpatterns = [
   	#re_path(r'^$', views.dashboard_render, name='index'),
    re_path(r'^logout/$', LogoutView.as_view(), {'next_page': settings.LOGOUT_REDIRECT_URL}, name='logout'),
] + user_urls