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