import os
import json
from django.db import models
from rest_framework import status
from rest_framework.response import Response

class Local(models.Model):
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    type = models.CharField(max_length=50)
    contact = models.CharField(max_length=100)
    hours = models.CharField(max_length=100)
    menu_pdf = models.FileField(upload_to='menus/', blank=True, null=True)
    logo = models.ImageField(upload_to='logos/', blank=True, null=True)
    num_tables = models.IntegerField(default=10)
    data_file_path = models.CharField(max_length=255, blank=True, null=True)  # Ruta al archivo JSON

    def create_order(self, local_id, table_number, order_details):
        file_path = os.path.join('data', f'local_{local_id}_tables.json')
        if not os.path.exists(file_path):
            return Response({"error": "Archivo de datos no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        with open(file_path, 'r+') as file:
            data = json.load(file)
            # Generamos un ID de pedido único combinando el ID del local y el contador
            order_id = f'{local_id}-{data["order_counter"]}'            
            new_order = {
                "id": order_id,
                "description": order_details,
                "status": 'Pending',
                "mozo": False
            }

            if table_number == 0:
                table = next((t for t in data["tables"] if t["number"] == 0), None)
                table["orders"].append(new_order)
            else:
                table = next((t for t in data["tables"] if t["number"] == table_number), None)
                if not table:
                    return Response({"error": "Mesa no encontrada."}, status=status.HTTP_404_NOT_FOUND)
                
                if table["order"] is not None:
                    return Response({"error": "La mesa ya tiene un pedido."}, status=status.HTTP_400_BAD_REQUEST)
                
                table["order"] = new_order
            
            data["order_counter"] += 1
            file.seek(0)
            json.dump(data, file, indent=4)
            file.truncate()

        return Response({"message": "Pedido creado con éxito.", "order_id": order_id}, status=status.HTTP_201_CREATED)

            
    def __str__(self):
        return self.name
