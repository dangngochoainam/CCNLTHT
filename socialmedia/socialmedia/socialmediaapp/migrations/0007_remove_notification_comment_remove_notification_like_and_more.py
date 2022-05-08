# Generated by Django 4.0.4 on 2022-05-06 04:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('socialmediaapp', '0006_hastag_active_hastag_created_date_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notification',
            name='comment',
        ),
        migrations.RemoveField(
            model_name='notification',
            name='like',
        ),
        migrations.AddField(
            model_name='comment',
            name='notification',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.PROTECT, to='socialmediaapp.notification'),
        ),
        migrations.AddField(
            model_name='like',
            name='notification',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.PROTECT, to='socialmediaapp.notification'),
        ),
    ]