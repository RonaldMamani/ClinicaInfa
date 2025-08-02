import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicosService {
  private apiUrl = 'http://localhost:8000/api/medicos';

  constructor(private http: HttpClient) {}

  getMedicos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}