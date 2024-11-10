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
    menu_pdf: '',
    logo: ''
  };

  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.local.name);
    formData.append('latitude', this.local.latitude);
    formData.append('longitude', this.local.longitude);
    formData.append('type', this.local.type);
    formData.append('contact', this.local.contact);
    formData.append('hours', this.local.hours);
    formData.append('logo', this.local.logo);
    if (this.selectedFile) {
      formData.append('menu_pdf', this.selectedFile);
    }

    this.http.post('http://localhost:8000/api/locales/', formData)
      .subscribe(response => {
        console.log('Local registrado con éxito:', response);
      });
  }
}