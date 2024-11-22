import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-local-manager',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './local-manager.component.html',
  styleUrls: ['./local-manager.component.scss']
})
export class LocalManagerComponent {
  showTableOrders = false;
  localId: number | null = null;
  tables: any[] = [];
  newStatus: string = '';

  constructor(private http: HttpClient) {}

  toggleTableOrders() {
    if (this.localId) {
      this.showTableOrders = !this.showTableOrders;
      if (this.showTableOrders) {
        this.fetchOrders();
      }
    } else {
      alert('Por favor, ingrese un ID de local antes de continuar.');
    }
  }

  fetchOrders() {
    if (this.localId) {
      this.http.get(`https://arqweb-tp-django.onrender.com/api/locales/${this.localId}/tables-orders/`).subscribe(
        (data: any) => {
          if (data.tables) {
            this.tables = data.tables;
            console.log(data);
          } else {
            alert('ID de local no válido o local no encontrado.');
            this.tables = [];
          }
        },
        (error) => {
          console.error('Error al obtener las mesas:', error);
          alert('Error al obtener las mesas: ' + error.error?.error || 'Desconocido');
          this.tables = [];
        }
      );
    }
  }

  updateOrderStatus(tableNumber: number, orderId: number, newStatus: string) {
    if (this.localId && orderId != null) {
      const requestData = {
        order_id: orderId,
        status: newStatus,
      };

      this.http.put(`https://arqweb-tp-django.onrender.com/api/locales/${this.localId}/tables-orders/`, requestData)
        .subscribe(
          (response: any) => {
            alert('Estado del pedido actualizado con éxito');
            console.log('Respuesta del servidor:', response);
            this.fetchOrders();
          },
          error => {
            console.error('Error al actualizar el estado:', error);
            alert('Hubo un error al actualizar el estado del pedido.');
          }
        );
    } else {
      alert('Por favor, complete todos los campos.');
    }
  }

  releaseMozo(orderId: number, mozoSolicitado:boolean) {
    if (!mozoSolicitado) {
      alert('El mozo no está solicitado!');
      return; 
    }
    // Realizar un GET para obtener el pedido
    this.http.get(`https://arqweb-tp-django.onrender.com/api/locales/${this.localId}/tables-orders/`).subscribe(
      (data: any) => {
        let orderFound = null;
        for (const table of data.tables) {
          if (table.orders) {
            orderFound = table.orders.find((order: any) => order.id === orderId);
          } else if (table.order) {
            if (table.order.id === orderId) {
              orderFound = table.order;
            }
          }
          if (orderFound) break;
        }

        if (orderFound) {
          // realizar el PUT para desactivar el llamado al mozo
          this.http.put(`https://arqweb-tp-django.onrender.com/api/locales/${this.localId}/tables-orders/`, {
            order_id: orderId,
            mozo: false  
          }).subscribe(
            (response) => {
              alert('La mesa ya fue atendida');
              console.log('Respuesta del servidor:', response);
              this.fetchOrders();
            },
            (error) => {
              console.error('No se pudo liberar al Mozo:', error);
              alert('No se pudo liberar al Mozo.');
            }
          );
        }
      },
      (error) => {
        console.error('Error al obtener el pedido:', error);
        alert('Error al obtener el pedido.');
      }
    );
}  

  releaseTable(tableNumber: number) {
    if (this.localId && confirm('¿Está seguro de que desea liberar la mesa?')) {
      const requestData = { table_number: tableNumber };
      this.http.delete(`https://arqweb-tp-django.onrender.com/api/locales/${this.localId}/tables-orders/`, { body: requestData }).subscribe(
        () => {
          alert('Mesa liberada con éxito');
          this.fetchOrders();
        },
        (error) => {
          alert('Error al liberar la mesa: ' + error.error?.error || 'Desconocido');
        }
      );
    } else if (!this.localId) {
      alert('Por favor, ingrese un ID de local antes de continuar.');
    }
  }

  releaseAllTables() {
    if (this.localId && confirm('¿Está seguro de que desea liberar todas las mesas?')) {
        let action = null; 

        if (confirm('¿Eliminar incluso pedidos de PickUp?')) {
            action = 'release_all_pickup' ; 
        } else {
            action = 'release_all'; 
        }

      
        this.http.delete(`https://arqweb-tp-django.onrender.com/api/locales/${this.localId}/tables-orders/?action=${action}`).subscribe(
            () => {
                alert('Todas las mesas liberadas con éxito');
                this.fetchOrders();
            },
            (error) => {
                alert('Error al liberar todas las mesas: ' + (error.error?.error || 'Desconocido'));
            }
        );
    } else if (!this.localId) {
        alert('Por favor, ingrese un ID de local antes de continuar.');
    }
}


  deleteLocal() {
    if (this.localId && confirm('¿Está seguro de que desea eliminar el local? Esta acción no se puede deshacer.')) {
      this.http.delete(`https://arqweb-tp-django.onrender.com/api/locales/${this.localId}/tables-orders/?action=delete_local`).subscribe(
        () => {
          alert('Local eliminado con éxito');
          this.localId = null;
          this.tables = [];
        },
        (error) => {
          alert('Error al eliminar el local: ' + error.error?.error || 'Desconocido');
        }
      );
    } else if (!this.localId) {
      alert('Por favor, ingrese un ID de local antes de continuar.');
    }
  }
}
