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

        instance.data_file_path = os.path.join(base_dir, f'local_{instance.id}_tables.json')
        print(f"Data file path asignado: {instance.data_file_path}")

        if not os.path.exists(instance.data_file_path):
            initial_data = {
                "order_counter": 1,  
                "tables": [
                    {"number": 0, "orders": []} 
                ] + [
                    {"number": i + 1, "order": None} for i in range(instance.num_tables)
                ]
            }

            with open(instance.data_file_path, 'w') as json_file:
                json.dump(initial_data, json_file)

        instance.save()
