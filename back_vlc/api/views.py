from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .data import locales_data

class LocalListView(APIView):
    def get(self, request):
        return Response(locales_data)
