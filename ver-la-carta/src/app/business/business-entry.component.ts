import { Component } from '@angular/core';
import { RegisterLocalComponent } from './register-local/register-local.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocalManagerComponent } from './local-manager/local-manager.component';

@Component({
  selector: 'app-business-entry',
  standalone: true,
  templateUrl: './business-entry.component.html',
  styleUrls: ['./business-entry.component.scss'],
  imports: [RegisterLocalComponent, FormsModule, CommonModule, LocalManagerComponent]
})
export class BusinessEntryComponent {
  showRegisterForm = false;

  toggleRegisterForm() {
    this.showRegisterForm = !this.showRegisterForm;
  }
}
