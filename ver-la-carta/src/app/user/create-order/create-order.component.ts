import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MarkerService } from '../../marker.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit, OnChanges {
  @Input() localId: number | null = null;
  @Input() tableNumber: number | null = null;
  @Input() userLocation: L.LatLng | null = null; // Recibir la ubicación del usuario
  orderDetails: string = '';
  localDetails: any = null;
  menuPdfUrl: string | null = null;
  isPickUp: boolean = false; 

  constructor(private http: HttpClient, private markerService: MarkerService) {}

  ngOnInit(): void {
    if (this.localId !== null) {
      this.loadLocalDetails(this.localId);
    }
    if (this.tableNumber === 0) {
      this.isPickUp = true; 
      this.togglePickUp(); 
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['localId'] && !changes['localId'].firstChange) {
      this.loadLocalDetails(this.localId!);
    }
  }

  private loadLocalDetails(localId: number): void {
    this.markerService.getLocales().subscribe(
      (locales: any[]) => {
        const local = locales.find(l => l.id === localId);
        if (local) {
          this.localDetails = local;
          this.menuPdfUrl = `https://arqweb-tp-django.onrender.com${local.menu_pdf}`;
        } else {
          console.error('No se encontró un local con el ID especificado');
        }
      },
      error => {
        console.error('Error al cargar los detalles del local:', error);
      }
    );
  }

  togglePickUp(): void {
    if (this.isPickUp) {
      this.tableNumber = 0; // Asigna 0 cuando se activa PickUp
    }
  }

  onSubmit(): void {
    if (this.localId !== null && (this.isPickUp || this.tableNumber !== null)) {
      if (this.tableNumber && this.tableNumber >= 1 && this.userLocation && this.localDetails) {
        const localLatLng = L.latLng(this.localDetails.latitude, this.localDetails.longitude);
        const distance = this.calculateDistance(this.userLocation, localLatLng);
        console.log(localLatLng, this.userLocation, distance);

        if (distance > 5000) {
          alert('El local está a más de 5000 metros de distancia. No se puede realizar el pedido.');
          return;
        }
      }

      const orderData = {
        table_number: this.tableNumber,
        order_details: this.orderDetails,
      };

      this.http.post(`https://arqweb-tp-django.onrender.com/api/locales/${this.localId}/tables-orders/`, orderData)
        .subscribe(
          (response: any) => {
            console.log('Pedido creado con éxito:', response);
            alert(`Pedido realizado con éxito. Número del pedido: ${response.order_id}`);
          },
          error => {
            console.error('Error al realizar el pedido:', error);
            alert('Error al realizar el pedido. Por favor, inténtelo de nuevo.');
          }
        );
    }
  }

  onTableNumberChange(): void {
    if (this.tableNumber === 0) {
      this.isPickUp = true; 
    } else {
      this.isPickUp = false; 
    }
    this.togglePickUp(); 
  }

  private calculateDistance(userLatLng: L.LatLng, localLatLng: L.LatLng): number {
    return userLatLng.distanceTo(localLatLng);
  }

  
}
