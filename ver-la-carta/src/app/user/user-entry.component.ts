import { Component } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { QrScannerComponent } from '../qr-scanner/qr-scanner.component';
import { CreateOrderComponent } from '../create-order/create-order.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-entry',
  standalone: true,
  templateUrl: './user-entry.component.html',
  styleUrls: ['./user-entry.component.scss'],
  imports: [MapComponent, QrScannerComponent, CreateOrderComponent, CommonModule]
})
export class UserEntryComponent {
  selectedLocalId: number | null = null;

  onShowOrderForm(localId: number): void {
    this.selectedLocalId = localId;
  }
}