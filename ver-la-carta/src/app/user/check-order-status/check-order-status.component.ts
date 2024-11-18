import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-check-order-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './check-order-status.component.html',
  styleUrls: ['./check-order-status.component.scss']
})
export class CheckOrderStatusComponent {
  orderId: string = '';
  orderStatus: string | null = null;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  checkOrderStatus() {
    if (this.orderId) {
      const [localId, _] = this.orderId.split('-');
  
      this.http.get(`http://localhost:8000/api/locales/${localId}/tables-orders/`).subscribe(
        (data: any) => {
          let orderFound = null;
          for (const table of data.tables) {
            if (table.orders) {
              // Si hay un array de órdenes, buscar en él
              orderFound = table.orders.find((order: any) => order.id === this.orderId);
            } else if (table.order) {
              // Si hay un solo objeto de orden, compararlo directamente
              if (table.order.id === this.orderId) {
                orderFound = table.order;
              }
            }
            // Si se encuentra el pedido, salir del bucle
            if (orderFound) break;
          }

          if (orderFound) {
            this.orderStatus = orderFound.status;
            this.errorMessage = null;
          } else {
            this.errorMessage = 'Pedido no encontrado.';
            this.orderStatus = null;
          }
        },
        (error) => {
          console.error('Error al obtener el pedido:', error);
          this.errorMessage = 'Error al obtener el pedido.';
          this.orderStatus = null;
        }
      );
    } else {
      this.errorMessage = 'Por favor, ingrese un ID de pedido válido.';
      this.orderStatus = null;
    }
  }
  
}