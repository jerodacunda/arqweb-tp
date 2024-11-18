## Instalar:
### Requisitos para instalar Angular
- nodejs: `sudo apt install nodejs`
- npm: `sudo apt install npm`

### Instalar Angular
https://docs.angular.lat/guide/setup-local
- angular cli: `sudo npm install -g @angular/cli`

- (Levantar virtual env en el directorio)


### Instalar Django
https://docs.djangoproject.com/en/5.1/intro/tutorial01/

- instalar django: `pip install django==5.1.3` 

### Dependencias
- Instalar leaflet (para Map en Angular) `npm install leaflet`
- django rest framework: 
`pip install djangorestframework`
- `qrcode` para generar QRs para las mesas

## Levantar servidor y host de la pagina
- Activar entorno virtual:
- `cd .../arqweb-tp`
- `source venv/bin/activate`
- Ejecutar servidor Django:
- `cd back_vlc`
- `python manage.py runserver`
- Correr Proyecto Angular
- `cd ver-la-carta`
- `npm start`

## Estructura del proyecto
### Backend (Django)

```
api/
|-- migrations/                # Se usa si cambiamos algo de la base de datos.
|-- admin.py                   # Configuración del panel de administración de Django.
|-- apps.py                    # Configuración de la aplicación Django (?).
|-- models.py                  # Definición de los modelos de la base de datos (Locales)
|-- serializers.py             # Serializadores para transformar datos entre modelos y JSON.
|-- tests.py                   # Pruebas unitarias de la aplicación (?)
|-- urls.py                    # Definición de las rutas 
|-- views.py                   # Vistas que manejan la lógica de las solicitudes HTTP (Get/Post/Put/Delete para locales y pedidos).

back_vlc/
|-- settings.py                # Configuración global del proyecto Django (base de datos, apps instaladas, directorios, etc.).

data/
|-- media/                     # Mesas/Pedidos, imagenes y menues de los locales

qr_for_tables/                 # códigos QR de ejemplo para las mesas.
db.sqlite3                     # base de datos SQLite para almacenamiento de locales.
manage.py                      # 
qr_generator.py                # Script para la creación de códigos QR.
```

### Frontend (Angular)

```
src/
|-- index.html                 # Archivo de entrada principal del proyecto Angular.
|-- main.ts                    # Archivo principal de inicio de la aplicación Angular.
|-- styles.css                 # Estilos globales de la aplicación.
|-- app/
    |-- business-entry.component/
        |-- local-manager.component/
            |-- local-manager.component.html     # Vista para la gestión de locales y pedidos.
            |-- local-manager.component.ts       # Lógica de gestión de locales y pedidos.
        |-- register-local.component/           
            |-- register-local.component.html    # Vista para registrar un local.
            |-- register-local.component.ts      # Lógica del componente de registro de locales.
        |-- business-entry.component.html    # Vista para la seccion business.
        |-- business-entry.component.ts      # Lógica de seccion business.
    |-- user-entry.component/
        |-- check-order-status.component/           
            |-- check-order-status.component.html    # Vista para consultar estado de un pedido.
            |-- check-order-status.component.ts      # 
        |-- create-order.component/
            |-- create-order.component.html      # Vista para la creación de pedidos.
            |-- create-order.component.ts        # Lógica del componente para crear pedidos.
        |-- map.component/
            |-- map.component.html               # Vista de mapa con locales
            |-- map.component.ts                 # Lógica del componente de mapas.
        |-- user-entry.component.html        # Vista para la entrada de usuarios.
        |-- user-entry.component.ts          # Lógica del componente de entrada de usuarios.
    |-- app.component/
        |-- app.component.html               # Vista principal de la aplicación.
        |-- app.component.ts                 # Lógica principal del componente raíz.
    |-- app.routes.ts                        # Definición de rutas de la aplicación.
    |-- marker.service.ts                    # Servicio de getLocales para el mapa y para hacer pedidos.
```
