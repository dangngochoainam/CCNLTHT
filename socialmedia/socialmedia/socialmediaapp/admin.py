from django.contrib import admin
from django.db.models import Count
from django.template.response import TemplateResponse
from .models import *
from django.utils.html import mark_safe
# from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django.urls import path


class PostsAdmin(admin.ModelAdmin):
    search_fields = ['title']
    readonly_fields = ['image_view']

    def image_view(self, course):
        if course:
            return mark_safe(
                '<img src="/static/{url}" width="120" />' \
                    .format(url=course.image.name)
            )

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
                                # })


admin.site.register(Posts, PostsAdmin)
admin.site.register(AuctionsDetails)
admin.site.register(User)
admin.site.register(Hastag)
admin.site.register(UserRole)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Notification)



# Register your models here.
