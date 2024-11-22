import { Component, OnInit } from '@angular/core';
import { BusinessEntryComponent } from './business/business-entry.component';
import { UserEntryComponent } from './user/user-entry.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BusinessEntryComponent, UserEntryComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ver-la-carta';
  currentMode: 'business' | 'user' | null = null;
  selectedLocalId: number | null = null;
  selectedTableNumber: number | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Leer parámetros de la URL al cargar el componente (para ingreso con QR)
    this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      const localId = params['localId'];
      const tableNumber = params['tableNumber'];

      if (mode === 'user') {
        this.currentMode = 'user';
        if (localId && tableNumber) {
          this.selectedLocalId = Number(localId);
          this.selectedTableNumber = Number(tableNumber);
        }
      }
    });
  }

  selectMode(mode: 'business' | 'user'): void {
    this.currentMode = mode;
  }
}