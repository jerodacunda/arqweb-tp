import { Component } from '@angular/core';
import { BusinessEntryComponent } from './business/business-entry.component';
import { UserEntryComponent } from './user/user-entry.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BusinessEntryComponent, UserEntryComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ver-la-carta';
  currentMode: 'business' | 'user' | null = null;  

  selectMode(mode: 'business' | 'user'): void {
    this.currentMode = mode;
  }
}
