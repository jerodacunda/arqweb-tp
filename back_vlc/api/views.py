from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Local
from .serializers import LocalSerializer

class LocalListView(APIView):
    def get(self, request):
        locales = Local.objects.all()  # Consulta a la base de datos
        serializer = LocalSerializer(locales, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = LocalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Guarda automáticamente el objeto en la base de datos
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
