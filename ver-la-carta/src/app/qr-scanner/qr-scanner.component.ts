import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [ZXingScannerModule, CommonModule],
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss']
})
export class QrScannerComponent {
  @Output() scanSuccess = new EventEmitter<{ localId: number, tableNumber: number }>();
  public scannedResult: string = "";
  public scanned: boolean = false;

  onScanSuccess(result: string): void {
    this.scannedResult = result;
    this.scanned = true;
    console.log('Resultado escaneado:', result);

    // Expresión regular para extraer los valores
    const match = result.match(/^local_(\d+)_table_(\d+)$/);
    if (match) {
      const localId = parseInt(match[1], 10);
      const tableNumber = parseInt(match[2], 10);
      console.log('Emitido:', { localId, tableNumber }); // Verificar que los valores sean correctos
      this.scanSuccess.emit({ localId, tableNumber });
    } else {
      console.error('Formato de QR no válido');
    }
  }
}
