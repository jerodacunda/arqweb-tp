## Instalar:
- nodejs: `sudo apt install nodejs`
- npm: `sudo apt install npm`

https://docs.angular.lat/guide/setup-local
- angular cli: `sudo npm install -g @angular/cli`

- Levantar venv en el directorio.

https://docs.djangoproject.com/en/5.1/intro/tutorial01/


- instalar django: `pip install django==5.1.3` 
- Instalar django rest framework: 
`pip install djangorestframework`

## Ejecutado para configurar ambiente:
### Angular:
`ng new ver-la-carta` (crea archivos front-end angular)
(stylesheet: SCSS)

### Django:
`django-admin startproject back_vlc` (crea archivos backend del proyecto)

`cd back_vlc`
- Ejecutar servidor django: `python3 manage.py runserver`
- Crear API (la API que conectará el front-end de Angular con el back-end de Django): `python3 manage.py startapp api`

(agregados api y rest_framework a INSTALLED_APPS)

