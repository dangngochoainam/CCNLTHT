# Generated by Django 4.0.4 on 2022-05-17 04:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('socialmediaapp', '0026_notification_creator'),
    ]

    operations = [
        migrations.AlterField(
            model_name='like',
            name='notification',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='like', to='socialmediaapp.notification'),
        ),
    ]
