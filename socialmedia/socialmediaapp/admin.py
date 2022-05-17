from django.contrib import admin
from django.db.models import Count
from django.template.response import TemplateResponse
from .models import *
from django.utils.html import mark_safe
# from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django.urls import path


class SocialMediaAppAdminSite(admin.AdminSite):
    site_header = "Mạng xã hội từ thiện"

    def get_urls(self):
        return [
                   path('posts-stats/', self.stats_view)
               ] + super().get_urls()

    def stats_view(self, request):
        p = Posts.objects.all().count()
        # stats = Posts.objects.annotate(lesson_count=Count('my_lesson')).values('id', 'subject', 'lesson_count')

        return TemplateResponse(request, 'admin/posts-stats.html')
        # 'templates/admin/posts-stats.html', {
        #     'count': c,
        #     'stats': stats
    #     # })



class PostsAdmin(admin.ModelAdmin):
    search_fields = ['title']
    readonly_fields = ['image_view']

    def image_view(self, course):
        if course:
            return mark_safe(
                '<img src="/static/{url}" width="120" />' \
                    .format(url=course.image.name)
            )


admin_site = SocialMediaAppAdminSite(name="SocialMediaApp")

admin_site.register(Posts, PostsAdmin)
admin_site.register(AuctionsDetails)
admin_site.register(User)
admin_site.register(Hastag)
admin_site.register(UserRole)
admin_site.register(Comment)
admin_site.register(Like)
admin_site.register(Notification)

