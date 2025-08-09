import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Medico } from '../../core/models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicosService {
  private apiUrl = 'http://localhost:8000/api/medicos';

  constructor(private http: HttpClient) {}

  getMedicos(): Observable<Medico[]> {
      return this.http.get<{ medicos: Medico[] }>(this.apiUrl).pipe(
        map(response => response.medicos)
      );
  }

  getTotalConsultasCount(): Observable<number> {
      return this.http.get<any>(`${this.apiUrl}/consultas/count/total`).pipe(
        map(response => response.total_consultas),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erro ao obter a contagem total de consultas.'));
        })
      );
    }
  
    getProximasConsultasCount(): Observable<number> {
      return this.http.get<any>(`${this.apiUrl}/consultas/count/agendadas`).pipe(
        map(response => response.consultas_agendadas),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Erro ao obter a contagem de consultas agendadas.'));
        })
      );
    }

}