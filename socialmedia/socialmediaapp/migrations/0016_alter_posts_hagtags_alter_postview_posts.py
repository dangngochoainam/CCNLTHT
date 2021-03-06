# Generated by Django 4.0.4 on 2022-05-07 14:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('socialmediaapp', '0015_notification_posts_postview'),
    ]

    operations = [
        migrations.AlterField(
            model_name='posts',
            name='hagtags',
            field=models.ManyToManyField(blank=True, related_name='articles', to='socialmediaapp.hastag'),
        ),
        migrations.AlterField(
            model_name='postview',
            name='posts',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='socialmediaapp.posts'),
        ),
    ]
