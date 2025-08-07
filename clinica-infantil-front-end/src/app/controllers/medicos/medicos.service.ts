import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Medico } from '../../core/models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicosService {
  private apiUrl = 'http://localhost:8000/api/medicos';

  constructor(private http: HttpClient) {}

  getMedicos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  GetMedicos(): Observable<Medico[]> {
      return this.http.get<{ medicos: Medico[] }>(this.apiUrl).pipe(
        map(response => response.medicos)
      );
  }
}