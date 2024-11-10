import json, os
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE_PATH = os.path.join(BASE_DIR, '../data/locales_data.json')

class LocalListView(APIView):
    def get(self, request):
        with open(DATA_FILE_PATH, 'r') as file:
            locales = json.load(file)
        return Response(locales)

    def post(self, request):
        new_local = request.data
        with open(DATA_FILE_PATH, 'r+') as file:
            locales = json.load(file)
            locales.append(new_local)
            file.seek(0)
            json.dump(locales, file, indent=4)
        return Response(new_local, status=status.HTTP_201_CREATED)