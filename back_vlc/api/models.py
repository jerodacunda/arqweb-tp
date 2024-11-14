import os
import json
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
    num_tables = models.IntegerField(default=10)
    data_file_path = models.CharField(max_length=255, blank=True, null=True)  # Ruta al archivo JSON

    def save(self, *args, **kwargs):
        # Guarda inicialmente el objeto si es nuevo para asegurar un ID
        if not self.pk:
            super().save(*args, **kwargs)
        
        # Asigna y crea `data_file_path` si no existe
        if not self.data_file_path:
            base_dir = 'data'
            if not os.path.exists(base_dir):
                os.makedirs(base_dir)

            self.data_file_path = os.path.join(base_dir, f'local_{self.id}_tables.json')
            print(f"Data file path asignado: {self.data_file_path}")  # Línea de depuración

            # Crear archivo JSON inicial si no existe
            if not os.path.exists(self.data_file_path):
                initial_data = {
                    "tables": [{
                        "number": i + 1,
                        "qr_code": f"local_{self.id}_table_{i + 1}",
                        "order": None} for i in range(self.num_tables)]
                }
                
                with open(self.data_file_path, 'w') as json_file:
                    json.dump(initial_data, json_file)

            # Guarda de nuevo para persistir el `data_file_path`
            super().save(*args, **kwargs)
    def __str__(self):
        return self.name
