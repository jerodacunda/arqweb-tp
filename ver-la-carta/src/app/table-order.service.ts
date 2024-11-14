import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableOrderService {
  private baseUrl = 'http://localhost:8000/api';  // URL base del backend

  constructor(private http: HttpClient) {}

  // Métodos para interactuar con la API de mesas y pedidos
  getTables(localId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/tables/?local=${localId}`);
  }

  getOrders(localId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/?local=${localId}`);
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders/`, orderData);
  }
}
