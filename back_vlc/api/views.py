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
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  # Imprime los errores de validación
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
        order_details = request.data.get("order_details")
        table_number = request.data.get("table_number")
        local = Local.objects.get(id=local_id)
        response = local.create_order(local_id, table_number, order_details)
        return response
    
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
    
        with open(file_path, 'r+') as file:
            data = json.load(file)
    
            if action == 'release_all':
                # Eliminar las órdenes de todas las mesas excepto la 0
                for table in data["tables"]:
                    if table["number"] >= 1:
                        table["order"] = None
    
                file.seek(0)
                json.dump(data, file, indent=4)
                file.truncate()
    
                return Response({"message": "Pedidos de todas las mesas >= 1 eliminados con éxito."}, status=status.HTTP_200_OK)
    
            elif action == 'release_all_pickup':
                # Eliminar las órdenes de todas las mesas, incluyendo la 0
                for table in data["tables"]:
                    if table["number"] >= 0:
                        if table["number"] == 0 and "orders" in table:
                            table["orders"] = []  # Vaciar la lista de órdenes de la mesa 0
                        else:
                            table["order"] = None
    
                file.seek(0)
                json.dump(data, file, indent=4)
                file.truncate()
    
                return Response({"message": "Pedidos de todas las mesas, incluyendo la mesa 0, eliminados con éxito."}, status=status.HTTP_200_OK)
    
            # Procedimiento estándar para eliminar un pedido específico
            table_number = request.data.get("table_number")
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

        order_id = request.data.get("order_id")
        new_status = request.data.get("status")

        with open(file_path, 'r+') as file:
            data = json.load(file)

            # Buscar el pedido por ID
            order_found = False
            for table in data["tables"]:
                if table["number"] != 0 and table["order"] and table["order"].get("id") == order_id:
                    table["order"]["status"] = new_status
                    order_found = True
                    break
                elif table.get("orders"):  # Manejo de múltiples pedidos (ej. mesa 0)
                    for order in table["orders"]:
                        if order["id"] == order_id:
                            order["status"] = new_status
                            order_found = True
                            break
                if order_found:
                    break

            if not order_found:
                return Response({"error": "Pedido no encontrado"}, status=status.HTTP_404_NOT_FOUND)

            # Si el pedido es de la mesa 0 y su estado es "Entregado", lo eliminamos de la lista de pedidos
            if new_status == "Entregado" and table["number"] == 0:
                if table.get("orders"):
                    # Eliminar el pedido que acaba de ser entregado
                    table["orders"] = [order for order in table["orders"] if order["id"] != order_id]


            file.seek(0)
            json.dump(data, file, indent=4)
            file.truncate()

        return Response({"message": "Estado del pedido actualizado"}, status=status.HTTP_200_OK)

def patch(self, request, local_id):
        order_id = request.data.get("orderId")
        mozo = request.data.get("mozo")

        file_path = os.path.join(DATA_DIR, f'local{local_id}_tables.json')
        if not os.path.exists(file_path):
            return Response({"error": "Local no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        with open(file_path, 'r+') as file:
            data = json.load(file)
            order_found = False
            for table in data["tables"]:
                if table["number"] != 0 and table["order"] and table["order"].get("id") == order_id:
                    table["order"]["mozo"] = mozo
                    order_found = True
                    break
                elif table.get("orders"):
                    for order in table["orders"]:
                        if order["id"] == order_id:
                            order["mozo"] = mozo
                            order_found = True
                            break
                if order_found:
                    break

            if not order_found:
                return Response({"error": "Pedido no encontrado"}, status=status.HTTP_404_NOT_FOUND)

            file.seek(0)
            json.dump(data, file, indent=4)
            file.truncate()

        return Response({"message": "Mozo llamado exitosamente"}, status=status.HTTP_200_OK)