from django.contrib import admin
from .admin import admin_site
from django.urls import path, include
from . import views
from rest_framework import routers
from . import views

router = routers.DefaultRouter()

router.register('posts', views.PostsViewSet)
router.register(prefix='posts', viewset=views.PostsDetailViewSet)
router.register('comments', views.CommentViewSet)
router.register(prefix='hagtags', viewset=views.HagtagViewSet)
router.register(prefix='users', viewset=views.UserViewSet)
router.register('notifications', views.NotificationViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin_site.urls),
    path('oauth2-info', views.AuthInfo.as_view())
]