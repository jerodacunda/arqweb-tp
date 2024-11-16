from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Local
import os
import json

@receiver(post_save, sender=Local)
def create_data_file_path(sender, instance, created, **kwargs):
    if created and not instance.data_file_path:
        base_dir = 'data'
        if not os.path.exists(base_dir):
            os.makedirs(base_dir)

        # Asignar la ruta del archivo
        instance.data_file_path = os.path.join(base_dir, f'local_{instance.id}_tables.json')
        print(f"Data file path asignado: {instance.data_file_path}")

        # Crear el archivo JSON si no existe
        if not os.path.exists(instance.data_file_path):
            initial_data = {
                "order_counter": 1,  # Inicializamos el contador de pedidos
                "tables": [
                    {"number": 0, "orders": []}  # Mesa de pickup con lista de pedidos vacía
                ] + [
                    {"number": i + 1, "order": None} for i in range(instance.num_tables)
                ]
            }

            with open(instance.data_file_path, 'w') as json_file:
                json.dump(initial_data, json_file)

        # Guardar el modelo nuevamente para que el campo `data_file_path` se persista
        instance.save()
