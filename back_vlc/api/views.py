import json
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Local
from .serializers import LocalSerializer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, '../data')

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

class LocalTableOrderView(APIView):
    def get(self, request, local_id):
        file_path = os.path.join(DATA_DIR, f'local_{local_id}_tables.json')
        if not os.path.exists(file_path):
            return Response({"error": "Archivo de datos no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
        with open(file_path, 'r') as file:
            data = json.load(file)
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, local_id):
        file_path = os.path.join(DATA_DIR, f'local_{local_id}_tables.json')
        if not os.path.exists(file_path):
            return Response({"error": "Local no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        new_order = request.data
        table_number = new_order.get("table_number")
        order_details = new_order.get("order")

        with open(file_path, 'r+') as file:
            data = json.load(file)
            table = next((t for t in data["tables"] if t["number"] == table_number), None)
            
            if not table:
                return Response({"error": "Mesa no encontrada"}, status=status.HTTP_404_NOT_FOUND)
            
            if table["order"] is not None:
                return Response({"error": "La mesa ya tiene un pedido"}, status=status.HTTP_400_BAD_REQUEST)
            
            table["order"] = order_details
            file.seek(0)
            json.dump(data, file, indent=4)
            file.truncate()
        
        return Response({"message": "Pedido creado", "table": table}, status=status.HTTP_201_CREATED)
        

    def delete(self, request, local_id):
        file_path = os.path.join(DATA_DIR, f'local_{local_id}_tables.json')
        if not os.path.exists(file_path):
            return Response({"error": "Archivo de datos no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
        action = request.GET.get('action')
        
        if action == 'delete_local':
            local = Local.objects.get(id=local_id)
            local.delete()
            # Eliminar el archivo de datos asociado al local
            os.remove(file_path)
            
            return Response({"message": "El local y sus datos han sido eliminados con éxito."}, status=status.HTTP_200_OK)
        
        table_number = request.data.get("table_number")

        with open(file_path, 'r+') as file:
            data = json.load(file)
            table = next((t for t in data["tables"] if t["number"] == table_number), None)
            
            if not table:
                return Response({"error": "Mesa no encontrada."}, status=status.HTTP_404_NOT_FOUND)
            
            if table["order"] is None:
                return Response({"error": "No hay pedido para eliminar."}, status=status.HTTP_400_BAD_REQUEST)
            
            table["order"] = None
            file.seek(0)
            json.dump(data, file, indent=4)
            file.truncate()
        
        return Response({"message": "Pedido eliminado con éxito.", "table": table}, status=status.HTTP_200_OK)
            
    
    def put(self, request, local_id):
        file_path = os.path.join(DATA_DIR, f'local_{local_id}_tables.json')
        if not os.path.exists(file_path):
            return Response({"error": "Local no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        table_number = request.data.get("table_number")
        new_status = request.data.get("status")

        with open(file_path, 'r+') as file:
            data = json.load(file)
            table = next((t for t in data["tables"] if t["number"] == table_number), None)
            
            if not table:
                return Response({"error": "Mesa no encontrada"}, status=status.HTTP_404_NOT_FOUND)
            
            if table["order"] is None:
                return Response({"error": "No hay pedido para actualizar"}, status=status.HTTP_400_BAD_REQUEST)
            
            table["order"]["status"] = new_status
            file.seek(0)
            json.dump(data, file, indent=4)
            file.truncate()
        
        return Response({"message": "Estado del pedido actualizado", "table": table}, status=status.HTTP_200_OK)
        