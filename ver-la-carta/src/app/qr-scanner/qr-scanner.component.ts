import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [ZXingScannerModule, CommonModule],
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss']
})
export class QrScannerComponent {
  public scannedResult: string = "";
  public scanned: boolean = false;

  onScanSuccess(result: string): void {
    this.scannedResult = result;
    this.scanned = true;
    console.log('Resultado escaneado:', result);
  }
}
