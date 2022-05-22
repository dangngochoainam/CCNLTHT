from _ast import mod

from django.contrib.auth.models import AbstractUser
from django.db import models



class ModelBase(models.Model):
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class UserRole(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class User(AbstractUser):
    avatar = models.ImageField(upload_to='users/%Y/%m')
    user_role = models.ForeignKey(UserRole, null=True, on_delete=models.SET_NULL, related_name='users')

    def __str__(self):
        return self.username


class Posts(ModelBase):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='products/%Y/%m/', null=True, blank=True)
    content = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='articles')
    auction_users = models.ManyToManyField(User, through='AuctionsDetails')
    hagtags = models.ManyToManyField('Hastag', blank=True, related_name='articles', null=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.title


class Hastag(ModelBase):
    name = models.CharField(max_length=150)

    def __str__(self):
        return self.name

class AuctionsDetails(ModelBase):
    active = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    posts = models.ForeignKey(Posts, on_delete=models.CASCADE, null=True)
    price = models.FloatField()
    content = models.TextField()

    def __str__(self):
        return str(self.posts) + ' - ' +str(self.price)

class Notification(ModelBase):
    content = models.CharField(max_length=255)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notification', null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications', null=True)
    posts = models.ForeignKey(Posts, on_delete=models.CASCADE, related_name='notifications', null=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.content


class Comment(ModelBase):
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name='commments')
    posts = models.ForeignKey(Posts, null=True, on_delete=models.CASCADE, related_name='comments')
    content = models.CharField(max_length=200)
    notification = models.OneToOneField(Notification, null=True, on_delete=models.PROTECT, related_name='comment')

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.content

class ActionBase(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    posts = models.ForeignKey(Posts, on_delete=models.CASCADE, null=True)
    created_date = models.DateTimeField(auto_now_add=True, null=True)


    class Meta:
        abstract = True
        unique_together = ('user', 'posts')


class Like(ActionBase):
    active = models.BooleanField(default=False)
    notification = models.OneToOneField(Notification, null=True, on_delete=models.SET_NULL, related_name='like')

    def __str__(self):
        return str(self.posts) +" - " + str(self.user)


class PostView(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    counter = models.IntegerField(default=0)
    posts = models.OneToOneField(Posts, on_delete=models.CASCADE, null=True)

# class PostsAdminView(models.Model):
#     created_date = models.DateTimeField(auto_now_add=True)
#     updated_date = models.DateTimeField(auto_now=True)
#     posts = models.OneToOneField(Posts, on_delete=models.CASCADE, null=True)
#     count_like = models.IntegerField(default=0)
#     count_comment = models.IntegerField(default=0)


class Report(ModelBase):
    active = models.BooleanField(default=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='creator_report')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='reported')
    content = models.TextField()






