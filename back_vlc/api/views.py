import json, os
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE_PATH = os.path.join(BASE_DIR, '../data/locales_data.json')
MEDIA_DIR = os.path.join(BASE_DIR, '../data/media/')

class LocalListView(APIView):
    def get(self, request):
        with open(DATA_FILE_PATH, 'r') as file:
            locales = json.load(file)
        return Response(locales)

    def post(self, request):
        new_local = {
            'name': request.data.get('name'),
            'latitude': request.data.get('latitude'),
            'longitude': request.data.get('longitude'),
            'type': request.data.get('type'),
            'contact': request.data.get('contact'),
            'hours': request.data.get('hours'),
            'menu_pdf': ''
        }

        if 'menu_pdf' in request.FILES:
            menu_pdf = request.FILES['menu_pdf']
            pdf_path = os.path.join(MEDIA_DIR, menu_pdf.name)
            with default_storage.open(pdf_path, 'wb+') as destination:
                for chunk in menu_pdf.chunks():
                    destination.write(chunk)
            new_local['menu_pdf'] = menu_pdf.name

        if 'logo' in request.FILES:
            logo = request.FILES['logo']
            logo_path = os.path.join(MEDIA_DIR, logo.name)
            with default_storage.open(logo_path, 'wb+') as destination:
                for chunk in logo.chunks():
                    destination.write(chunk)
            new_local['logo'] = logo.name

        with open(DATA_FILE_PATH, 'r+') as file:
            locales = json.load(file)
            locales.append(new_local)
            file.seek(0)
            json.dump(locales, file, indent=4)

        return Response(new_local, status=status.HTTP_201_CREATED)