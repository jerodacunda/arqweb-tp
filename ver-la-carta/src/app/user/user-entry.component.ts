import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class UserEntryComponent implements OnChanges {
  @Input() selectedLocalId: number | null = null;
  @Input() selectedTableNumber: number | null = null;

  onShowOrderForm(localId: number): void {
    this.selectedLocalId = localId;
  }

  onScanSuccess(event: { localId: number, tableNumber: number }): void {
    this.selectedLocalId = event.localId;
    this.selectedTableNumber = event.tableNumber;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedLocalId'] && this.selectedLocalId !== null) {
      this.onShowOrderForm(this.selectedLocalId);
    }
  }
}