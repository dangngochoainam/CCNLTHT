from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import *
from rest_framework import serializers



class HagtagSerializer(ModelSerializer):

    class Meta:
        model = Hastag
        fields = '__all__'


class WritableSerializerMethodField(SerializerMethodField):
    def __init__(self, **kwargs):
        self.setter_method_name = kwargs.pop('setter_method_name', None)
        self.deserializer_field = kwargs.pop('deserializer_field')

        super().__init__(**kwargs)

        self.read_only = False

    def bind(self, field_name, parent):
        retval = super().bind(field_name, parent)
        if not self.setter_method_name:
            self.setter_method_name = f'set_{field_name}'

        return retval

    def get_default(self):
        default = super().get_default()

        return {
            self.field_name: default
        }

    def to_internal_value(self, data):
        value = self.deserializer_field.to_internal_value(data)
        method = getattr(self.parent, self.setter_method_name)
        return {self.field_name: self.deserializer_field.to_internal_value(method(value))}


class UserSerializer(ModelSerializer):

    avatar = WritableSerializerMethodField(source='avatar', deserializer_field=serializers.ImageField(use_url='users/%Y/%m'))

    def set_avatar(self, obj):
        return obj

    def get_avatar(self, obj):
        # request = self.context['request']

        name = obj.avatar.name

        if name.startswith('static/'):
            path = '/%s' % name
        else:
            path = '/static/%s' % name

        return "http://127.0.0.1:8000" + path

        # return request.build_absolute_uri(path)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name',
                  'username', 'password', 'email', 'avatar']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


    def create(self, validated_data):
        data = validated_data.copy()
        user = User(**data)
        user.set_password(user.password)
        user.save()

        return user

class UserDetailsSerializer(UserSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'avatar']


class PostsSerializer(ModelSerializer):

    image = WritableSerializerMethodField(source='image',
                                           deserializer_field=serializers.ImageField(use_url='products/%Y/%m/'))
    def set_image(self, obj):
        return obj

    # image = SerializerMethodField(source='image')
    def get_image(self, obj):
        # request = self.context['request']

        name = obj.image.name

        if name.startswith('static/'):
            path = '/%s' % name
        else:
            path = '/static/%s' % name

        return "http://127.0.0.1:8000" + path

        # return request.build_absolute_uri(path)

    hagtags = HagtagSerializer(many=True)

    class Meta:
        model = Posts
        fields = ['id', 'title', 'image', 'user', 'hagtags', 'created_date']
        # fields = '__all__'



class PostsDetailSerializer(PostsSerializer):

    class Meta:
        model = PostsSerializer.Meta.model
        fields = PostsSerializer.Meta.fields + ['content', 'active']

    # def create(self, validated_data):
    #     hagtags_data = validated_data.pop('hagtags')
    #     posts = Posts.objects.create(**validated_data)
    #     for hagtag in hagtags_data:
    #         t, _ = Hastag.objects.get_or_create(**hagtag)
    #         t.articles.add(posts)
    #     return posts

class AuctionUsersSerializer(ModelSerializer):

    user = UserSerializer()

    class Meta:
        model = AuctionsDetails
        fields = ['id', 'user', 'content', 'price', 'created_date', 'active']

class CreaterPostsDetailSerializer(PostsSerializer):

    class Meta:
        model = PostsSerializer.Meta.model
        fields = PostsSerializer.Meta.fields + ['auction_users']


class LikeSerializer(ModelSerializer):

    class Meta:
        model = Like
        fields = '__all__'

class AuthPostsDetailSerializer(PostsDetailSerializer):
    like = SerializerMethodField()


    def get_like(self, posts):
        request = self.context.get('request')
        if request:
            return posts.like_set.filter(user=request.user, active=True).exists()


    class Meta:
        model = Posts
        fields = PostsDetailSerializer.Meta.fields + ['like']

class PostViewerSerializer(ModelSerializer):
    class Meta:
        model = PostView
        fields = ['id', 'counter', 'posts']


class CommentSerializer(ModelSerializer):

    user = UserSerializer()

    class Meta:
        model = Comment
        exclude = ['active']



class CreateCommentSerializer(ModelSerializer):

    class Meta:
        model = Comment
        fields = ['content', 'user', 'posts', 'updated_date', 'created_date', 'notification']

class PostsNotificationSerializer(ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Posts
        fields = ['id', 'title', 'image', 'user']


class NotificationSerializer(ModelSerializer):

    posts = PostsNotificationSerializer()
    creator = UserDetailsSerializer()

    class Meta:
        model = Notification
        fields = ['created_date', 'active', 'content', 'user', 'posts', 'creator']

