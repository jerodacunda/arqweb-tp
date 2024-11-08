import { Component } from '@angular/core';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-business-entry',
  standalone: true,
  templateUrl: './business-entry.component.html',
  styleUrls: ['./business-entry.component.scss'],
  imports: [MapComponent]
})
export class BusinessEntryComponent {}
