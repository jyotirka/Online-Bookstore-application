# Generated by Django 5.2.4 on 2025-07-26 18:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookshop', '0005_auto_20250722_2023'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='book',
            name='cover_image',
        ),
        migrations.AddField(
            model_name='book',
            name='cover_image_filename',
            field=models.ImageField(blank=True, null=True, upload_to='book_covers/'),
        ),
    ]
