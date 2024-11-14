import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})

export class CreateOrderComponent {
  @Input() localId: number | null = null;
  tableNumber: number | null = null;
  orderDetails: string = '';

  constructor(private http: HttpClient) {}

  onSubmit(): void {
    if (this.localId && this.tableNumber) {
      const orderData = {
        table_number: this.tableNumber,
        order: {description: this.orderDetails, status: 'Pending'},
      };

      this.http.post(`http://localhost:8000/api/locales/${this.localId}/tables-orders/`, orderData)
        .subscribe(
          response => {
            console.log('Pedido creado con éxito:', response);
            alert('Pedido creado con éxito');
          },
          error => {
            console.error('Error al crear el pedido:', error);
            alert('Hubo un error al crear el pedido');
          }
        );
    } else {
      alert('Debe seleccionar un número de mesa y detalles del pedido');
    }
  }
}