# Generated by Django 4.0.4 on 2022-05-06 09:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('socialmediaapp', '0007_remove_notification_comment_remove_notification_like_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='posts',
            options={'ordering': ['-id']},
        ),
    ]