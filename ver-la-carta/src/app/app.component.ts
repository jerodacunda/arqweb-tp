import { Component } from '@angular/core';
import { MapComponent } from './map/map.component';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MapComponent, QrScannerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ver-la-carta';
}
