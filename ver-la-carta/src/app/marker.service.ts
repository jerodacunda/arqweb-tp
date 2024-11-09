import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  private apiUrl = 'http://localhost:8000/api/locales/';  // URL del endpoint

  constructor(private http: HttpClient) {}

  getLocales(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
