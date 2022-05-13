from django.shortcuts import render
from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse, Http404
from rest_framework.views import APIView

from .models import *
from .serializers import *
from .paginator import BasePagination
from django.db.models import F
from django.conf import settings

# def index(request):
#     return HttpResponse('SocialMediaApp')


class PostsViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):

    lookup_field = ['title']
    queryset = Posts.objects.all()
    serializer_class = PostsDetailSerializer
    pagination_class = BasePagination



    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = PostsSerializer(page, many=True)

            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def get_queryset(self):

        q = self.queryset

        kw = self.request.query_params.get('kw')
        if kw is not None:
            q = q.filter(title__icontains=kw)

        hagtag = self.request.query_params.get('hagtag')
        if hagtag is not None:
            q = q.filter(hagtags=hagtag)

        return q

class PostsDetailViewSet(viewsets.ViewSet, generics.RetrieveAPIView,
                         generics.UpdateAPIView,
                         generics.DestroyAPIView):

    queryset = Posts.objects.filter(active=True)
    serializer_class = PostsDetailSerializer

    def retrieve(self, request, *args, **kwargs):
        if(self.get_object().user == request.user):
            instance = self.get_object()
            serializer = CreaterPostsDetailSerializer(instance)
        else:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        if request.user == self.get_object().user:
            return super().destroy(request, *args, **kwargs)

        return Response(status=status.HTTP_403_FORBIDDEN)

    def update(self, request, *args, **kwargs):
        if request.user == self.get_object().user:
            return super().update(request, *args, **kwargs)

        return Response(status=status.HTTP_403_FORBIDDEN)

    def partial_update(self, request, *args, **kwargs):
        if request.user == self.get_object().user:
            return super().partial_update(request, *args, **kwargs)

        return Response(status=status.HTTP_403_FORBIDDEN)


    def get_permissions(self):
        if self.action in ['add_comment', 'like']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['post'], detail=True, url_path='hagtags')
    def add_hagtag(self, request, pk):
        try:
            posts = self.get_object()
        except Http404:
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            hagtags = request.data.get('hagtags')
            if hagtags is not None:
                for tag in hagtags:
                    t, _ = Hastag.objects.get_or_create(name=tag)
                    posts.hagtags.add(t)

                posts.save()

                return Response(self.serializer_class(posts).data,
                                status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_404_NOT_FOUND)


    @action(methods=['post'], detail=True, url_path='auctions')
    def add_auctions(self, request, pk):
        try:
            posts = self.get_object()
        except Http404:
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            price = request.data.get('price')
            content = request.data.get('content')
            if price is not None:
                a = AuctionsDetails.objects.create(user=request.user, posts=posts,
                                                          price=price, content=content)
                posts.auction_users.add(request.user)
                posts.save()

                return Response(self.serializer_class(posts).data,
                                status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_404_NOT_FOUND)

    @action(methods=['get'], detail=True, url_path='get-buyer')
    def get_buyer(self, request, pk):
        posts = self.get_object()
        buyers = AuctionsDetails.objects.filter(posts=posts)
        return Response(AuctionUsersSerializer(buyers, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['post'], detail=True, url_path='buy')
    def buy(self, request, pk):
        if(request.user == self.get_object().user):
            try:
                posts = self.get_object()
            except:
                return Response(status=status.HTTP_404_NOT_FOUND)
            else:
                posts.active = False

                auctions_id = request.data.get('auctions_id')
                winer = request.data.get('email_winer')
                loser = request.data.get('email_loser')
                price = request.data.get('price')

                auction = AuctionsDetails.objects.get(pk=auctions_id)
                auction.active = True

                auction.save()
                posts.save()

                data = {"email_winer": winer, "email_loser": loser, "price": price}
                return Response(data=data, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_404_NOT_FOUND)

    @action(methods=['get'], url_path='comments', detail=True)
    def get_comments(self, request, pk):
        posts = self.get_object()
        comments = posts.comments.select_related('user').filter(active=True)

        return Response(CommentSerializer(comments, many=True).data,
                        status=status.HTTP_200_OK)


    @action(methods=['post'], url_path='add-comment', detail=True)
    def add_comment(self, request, pk):
        content = request.data.get('content')
        if content:
            notif = Notification.objects.create(content='Comment', user=request.user, posts=self.get_object())
            comment = Comment.objects.create(content=content, posts=self.get_object(), user=request.user, notification=notif)

            return Response(CreateCommentSerializer(comment).data,
                        status=status.HTTP_201_CREATED)

        return Response(status=status.HTTP_400_BAD_REQUEST)


    @action(methods=['post'], detail=True, url_path='like')
    def like(self, request, pk):
        posts = self.get_object()
        user = request.user

        l, _ = Like.objects.get_or_create(posts=posts, user=user)
        l.active = not l.active

        if l.active == True:
            notif, _ = Notification.objects.get_or_create(content='Like', user=request.user, posts=self.get_object())
            l.notification = notif

        try:
            l.save()

        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(data=AuthPostsDetailSerializer(posts, context={'request': request}).data, status=status.HTTP_200_OK)

    @action(methods=['get'], detail=True, url_path='views')
    def count_view(self, request, pk):
        v, _ = PostView.objects.get_or_create(posts=self.get_object())
        v.counter = F('counter') + 1
        v.save()

        v.refresh_from_db()

        return Response(PostViewerSerializer(v).data, status=status.HTTP_200_OK)


class CommentViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):

    queryset = Comment.objects.filter(active=True)
    serializer_class = CreateCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        if request.user == self.get_object().user:
            return super().destroy(request, *args, **kwargs)

        return Response(status=status.HTTP_403_FORBIDDEN)

    def partial_update(self, request, *args, **kwargs):
        if request.user == self.get_object().user:
            return super().partial_update(request, *args, **kwargs)

        return Response(status=status.HTTP_403_FORBIDDEN)



class HagtagViewSet(viewsets.ViewSet, generics.ListAPIView):

    queryset = Hastag.objects.filter(active=True)
    serializer_class = HagtagSerializer


class UserViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView, generics.RetrieveAPIView):

    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ['get_current_user']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'], detail=True, url_path='posts')
    def get_posts(self, request, pk):

        u = User.objects.get(pk=pk)
        posts = u.articles.filter(active=True)

        kw = request.query_params.get('kw')
        if kw is not None:
            posts = posts.filter(title__icontains=kw)

        return Response(PostsSerializer(posts, many=True).data,
                        status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False, url_path='current-user')
    def get_current_user(self, request):
        return Response(self.serializer_class(request.user).data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        if (self.get_object() == request.user):
            instance = self.get_object()
            serializer = self.get_serializer(instance)
        else:
            instance = self.get_object()
            serializer = UserDetailsSerializer(instance)
        return Response(serializer.data)


    @action(methods=['post'], detail=True, url_path='report')
    def report(self, request, pk):
        creator = request.user
        user = self.get_object()
        content = request.data.get('content')
        try:
            Report.objects.create(creator=creator, user=user, content=content)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)



class AuthInfo(APIView):
    def get(self, request):
        return Response(settings.OAUTH2_INFO, status=status.HTTP_200_OK)



