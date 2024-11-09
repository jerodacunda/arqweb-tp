import { Component, AfterViewInit } from '@angular/core';
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

  constructor(private markerService: MarkerService) { }
  private initMap(): void {
    this.map = L.map('map').setView([ -34.750847, -58.387544 ], 10);

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
      locales.forEach((local: { latitude: number; longitude: number; name: string; type: string; }) => {
        const marker = L.marker([local.latitude, local.longitude])
          .addTo(this.map)
          .bindPopup(`<b>${local.name}</b><br>${local.type}`);
      });
    });
  }
}