import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MarkerService } from '../marker.service';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})

export class CreateOrderComponent implements OnInit {
  @Input() localId: number | null = null;
  @Input() tableNumber: number | null = null;
  orderDetails: string = '';
  localDetails: any = null;
  menuPdfUrl: string | null = null;

  constructor(private http: HttpClient, private markerService: MarkerService) {}

  ngOnInit(): void {
    if (this.localId !== null) {
      this.loadLocalDetails(this.localId);
    }
  }

  private loadLocalDetails(localId: number): void {
    this.markerService.getLocales().subscribe(
      (locales: any[]) => {
        // Filtrar el local que coincide con el `localId`
        const local = locales.find(l => l.id === localId);

        if (local) {
          this.localDetails = local;
          this.menuPdfUrl = `http://localhost:8000/${local.menu_pdf}`;
        } else {
          console.error('No se encontró un local con el ID especificado');
        }
      },
      error => {
        console.error('Error al cargar los detalles del local:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.localId && this.tableNumber) {
      const orderData = {
        table_number: this.tableNumber,
        order: { description: this.orderDetails, status: 'Pending' },
      };

      this.http.post(`http://localhost:8000/api/locales/${this.localId}/tables-orders/`, orderData)
        .subscribe(
          response => {
            console.log('Pedido creado con éxito:', response);
            alert('Pedido realizado con éxito');
          },
          error => {
            console.error('Error al realizar el pedido:', error);
            alert('Ocurrió un error al realizar el pedido');
          }
        );
    }
  }
}
