import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MapComponent } from './map/map.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { CommonModule } from '@angular/common';
import { CheckOrderStatusComponent } from './check-order-status/check-order-status.component';

@Component({
  selector: 'app-user-entry',
  standalone: true,
  templateUrl: './user-entry.component.html',
  styleUrls: ['./user-entry.component.scss'],
  imports: [MapComponent, CreateOrderComponent, CommonModule, CheckOrderStatusComponent]
})
export class UserEntryComponent implements OnChanges {
  @Input() selectedLocalId: number | null = null;
  @Input() selectedTableNumber: number | null = null;
  @Output() localIdEvent = new EventEmitter<number>();


  onShowOrderForm(localId: number): void {
    this.selectedLocalId = localId;
    this.localIdEvent.emit(this.selectedLocalId);    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedLocalId'] && this.selectedLocalId !== null) {
      this.onShowOrderForm(this.selectedLocalId);
    }
  }
}