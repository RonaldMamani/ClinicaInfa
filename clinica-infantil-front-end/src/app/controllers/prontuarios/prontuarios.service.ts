import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ProntuarioDetailResponse, ProntuariosPaginateApiResponse } from '../../core/models/prontuarios.model';

@Injectable({
  providedIn: 'root'
})
export class ProntuariosService {
  private apiUrl = 'http://localhost:8000/api/prontuarios';

  constructor(private http: HttpClient) { }

  getTodosProntuarios(): Observable<ProntuariosPaginateApiResponse> {
    const url = `${this.apiUrl}`;
    return this.http.get<ProntuariosPaginateApiResponse>(url).pipe(
      catchError(error => {
        return throwError(() => new Error(error.error.message || 'Erro ao carregar prontuários.'));
      })
    );
  }

  getProntuarios(pageUrl: string | null = null): Observable<ProntuariosPaginateApiResponse> {
    const url = pageUrl ? pageUrl : this.apiUrl;
    return this.http.get<ProntuariosPaginateApiResponse>(url).pipe(
      catchError(error => {
        return throwError(() => new Error(error.error.message || 'Erro ao carregar prontuários.'));
      })
    );
  }

  getProntuarioDetalhes(id: number): Observable<ProntuarioDetailResponse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        return throwError(() => new Error(error.error.message || 'Erro ao carregar detalhes do prontuário.'));
      })
    );
  }

  getProntuarioByPacienteId(pacienteId: number): Observable<any> {
    const url = `${this.apiUrl}/paciente/${pacienteId}`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        if (error.status === 404) {
          console.log('Prontuário não encontrado para este paciente. (Isso é esperado para novos pacientes)');
          return new Observable(observer => observer.next({ prontuario: null }));
        }
        return throwError(() => new Error(error.error.message || 'Erro ao buscar prontuário.'));
      })
    );
  }
}