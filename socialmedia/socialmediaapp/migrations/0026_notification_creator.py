# Generated by Django 4.0.4 on 2022-05-16 12:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('socialmediaapp', '0025_alter_comment_options_alter_notification_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='creator',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='notification', to=settings.AUTH_USER_MODEL),
        ),
    ]