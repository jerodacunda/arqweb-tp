import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-local',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register-local.component.html',
  styleUrls: ['./register-local.component.scss']
})
export class RegisterLocalComponent {
  local = {
    name: '',
    latitude: '',
    longitude: '',
    type: '',
    contact: '',
    hours: '',
    menu_pdf: null as File | null,
    logo: null as File | null
  };

  constructor(private http: HttpClient) {}

  onSubmit() {
    // Formulario para enviar los datos al backend
    const formData = new FormData();
    for (const key in this.local) {
      if (Object.prototype.hasOwnProperty.call(this.local, key)) {
        formData.append(key, (this.local as any)[key]);
      }
    }

    this.http.post('http://localhost:8000/api/locales/', formData)
      .subscribe(response => {
        console.log('Local registrado con éxito:', response);
      });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    const fieldName = input.name;
  
    if (file && (fieldName === 'menu_pdf' || fieldName === 'logo')) {
      this.local[fieldName] = file;
    }
  }
  
}