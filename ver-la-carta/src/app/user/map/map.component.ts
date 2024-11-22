import { Component, AfterViewInit, EventEmitter, Output, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as L from 'leaflet';
import { MarkerService } from '../../marker.service';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnChanges {
  private map: any;
  @Output() showOrderForm = new EventEmitter<number>(); // Emite evento al setear local_id
  private locales: any[] = []; // Guardamos los locales cargados
  @Input() selectedLocalId: number | null = null;
  @Output() userLocation = new EventEmitter<L.LatLng>(); // Emitir la ubicación del usuario

  constructor(private markerService: MarkerService) {}

  private initMap(): void {
    this.map = L.map('map').setView([-34.750847, -58.387544], 10); // Ubicación predeterminada

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.loadLocales();

    // Intentamos obtener la ubicación del usuario
    this.getUserLocation();
  }

  private loadLocales(): void {
    this.markerService.getLocales().subscribe(locales => {
      this.locales = locales;
      locales.forEach((local: {
        id: number;
        latitude: number;
        longitude: number;
        name: string;
        type: string;
        contact: string;
        hours: string;
        logo: string;
        menu_pdf: string;
      }) => {
        const logoUrl = `https://arqweb-tp-django.onrender.com${local.logo}`;
        const menuPdfUrl = `https://arqweb-tp-django.onrender.com${local.menu_pdf}`;

        const marker = L.marker([local.latitude, local.longitude])
          .addTo(this.map)
          .bindPopup(this.createPopupContent(local));

        marker.on('popupopen', () => {
          const button = document.getElementById(`order-button-${local.id}`);
          if (button) {
            button.addEventListener('click', () => this.showOrderForm.emit(local.id));
          }
        });
      });
    });
  }

  private createPopupContent(local: any): string {
    const logoUrl = `https://arqweb-tp-django.onrender.com${local.logo}`;
    const menuPdfUrl = `https://arqweb-tp-django.onrender.com${local.menu_pdf}`;
    return `
      <div>
        <h3>${local.name} (ID: ${local.id})</h3>
        <p>Tipo: ${local.type}</p>
        <p>Contacto: ${local.contact}</p>
        <p>Horario: ${local.hours}</p>
        ${local.logo ? `<img src="${logoUrl}" alt="Logo" style="width:100px;height:auto;">` : ''}
        ${local.menu_pdf ? `<p><a href="${menuPdfUrl}" target="_blank">Ver menú en PDF</a></p>` : ''}
        <button id="order-button-${local.id}">Realizar Pedido</button>
      </div>
    `;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedLocalId'] && this.selectedLocalId !== null) {
      this.centerMapOnLocal(this.selectedLocalId);
    }
  }

  centerMapOnLocal(localId: number): void {
    this.markerService.getLocales().subscribe(locales => {
      locales.forEach((local: {
        id: number;
        latitude: number;
        longitude: number;
        name: string;
        type: string;
        contact: string;
        hours: string;
        logo: string;
        menu_pdf: string;
      }) => {
        if(local["id"] == localId){
          this.map.setView([local.latitude, local.longitude], 15);
        }
      });
    });
  }

  private getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          console.log('Ubicación obtenida:', userLat, userLng); // Ver las coordenadas
          const userLatLng = L.latLng(userLat, userLng);
          this.userLocation.emit(userLatLng); // Emite la ubicación del usuario  
          // Mostrar la ubicación del usuario en el mapa
          const userMarker = L.marker([userLat, userLng]).addTo(this.map);
          userMarker.bindPopup('Ubicación actual del usuario');
        },
        (error) => {
          console.error('Error al obtener la ubicación del usuario: ', error);
          alert('No se pudo obtener la ubicación del usuario. Se usará la ubicación predeterminada.');
        },
        {
          enableHighAccuracy: true,  // Forzar mayor precisión 
          timeout: 10000,            // Tiempo máximo para obtener la ubicación
          maximumAge: 0             // No usar ubicaciones en caché
        }
      );
    } else {
      console.error('Geolocalización no soportada en este navegador.');
    }
  }
}
