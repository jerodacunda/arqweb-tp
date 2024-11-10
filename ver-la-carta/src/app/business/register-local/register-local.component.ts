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

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http.post('http://localhost:8000/api/locales/', this.local)
      .subscribe(response => {
        console.log('Local registrado con éxito:', response);
      });
  }
}