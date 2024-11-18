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
  isPickUp: boolean = false; // Nueva propiedad para el control de PickUp

  constructor(private http: HttpClient, private markerService: MarkerService) {}

  ngOnInit(): void {
    if (this.localId !== null) {
      this.loadLocalDetails(this.localId);
    }
    if (this.tableNumber === 0) {
      this.isPickUp = true; // Marcar la casilla de PickUp si el número de mesa es 0
      this.togglePickUp(); // Aplicar la lógica de bloqueo y ocultación
    }
  }

  private loadLocalDetails(localId: number): void {
    this.markerService.getLocales().subscribe(
      (locales: any[]) => {
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

  togglePickUp(): void {
    if (this.isPickUp) {
      this.tableNumber = 0; // Asigna 0 cuando se activa PickUp
    } else {
      this.tableNumber = null; // Permite modificar el número de mesa cuando PickUp está desactivado
    }
  }

  onSubmit(): void {
    if (this.localId !== null && (this.isPickUp || this.tableNumber !== null)) {
      const orderData = {
        table_number: this.tableNumber,
        order_details: this.orderDetails,
      };
  
      this.http.post(`http://localhost:8000/api/locales/${this.localId}/tables-orders/`, orderData)
        .subscribe(
          (response: any) => {
            console.log('Pedido creado con éxito:', response);
            alert(`Pedido realizado con éxito. Número del pedido: ${response.order_id}`);
          },
          error => {
            console.error('Error al realizar el pedido:', error);
            alert('Ocurrió un error al realizar el pedido');
          }
        );
    }
  }

  onTableNumberChange(): void {
    if (this.tableNumber === 0) {
      this.isPickUp = true; // Marca automáticamente la casilla de PickUp
    } else {
      this.isPickUp = false; // Desmarca la casilla si el valor no es 0
    }
    this.togglePickUp(); // Llama al método para actualizar la lógica de bloqueo/ocultación
  }
  
}
