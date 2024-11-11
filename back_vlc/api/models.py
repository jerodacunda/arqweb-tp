from django.db import models

class Local(models.Model):
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    type = models.CharField(max_length=50)
    contact = models.CharField(max_length=100)
    hours = models.CharField(max_length=100)
    menu_pdf = models.FileField(upload_to='menus/', blank=True, null=True)
    logo = models.ImageField(upload_to='logos/', blank=True, null=True)