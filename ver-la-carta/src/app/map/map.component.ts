import { Component, AfterViewInit, EventEmitter, Output } from '@angular/core';
import * as L from 'leaflet';
import { MarkerService } from '../marker.service';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  private map: any;
  @Output() showOrderForm = new EventEmitter<number>(); // Emisor de evento para el localId

  constructor(private markerService: MarkerService) {}

  private initMap(): void {
    this.map = L.map('map').setView([-34.750847, -58.387544], 10);
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
  }

  private loadLocales(): void {
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
        const logoUrl = `http://localhost:8000/${local.logo}`;
        const menuPdfUrl = `http://localhost:8000/${local.menu_pdf}`;

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
    const logoUrl = `http://localhost:8000/${local.logo}`;
    const menuPdfUrl = `http://localhost:8000/${local.menu_pdf}`;
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
}
