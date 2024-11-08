import { Component } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { QrScannerComponent } from '../qr-scanner/qr-scanner.component';

@Component({
  selector: 'app-user-entry',
  standalone: true,
  templateUrl: './user-entry.component.html',
  styleUrls: ['./user-entry.component.scss'],
  imports: [MapComponent, QrScannerComponent]
})
export class UserEntryComponent {}
