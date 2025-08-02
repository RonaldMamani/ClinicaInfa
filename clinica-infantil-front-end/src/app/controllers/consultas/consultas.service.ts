import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

export interface UpdateConsultaResponse {
  status: boolean;
  message: string;
  consulta: any;
}

import { ConsultasApiResponse, ConsultasAgendadasApiResponse, ConsultaDetailsResponse, Consulta } from '../../core/models/consultas.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {
  // Use a URL base do seu backend diretamente, sem o arquivo de environment
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getTodasConsultas(): Observable<ConsultasApiResponse> {
    // Rota correta: /api/consultas/todas
    const url = `${this.apiUrl}/consultas`;
    return this.http.get<ConsultasApiResponse>(url);
  }

  getConsultasAgendadas(): Observable<ConsultasAgendadasApiResponse> {
    const url = `${this.apiUrl}/consultas/agendadas`;
    return this.http.get<ConsultasAgendadasApiResponse>(url);
  }

  getConsultaById(id: number): Observable<ConsultaDetailsResponse> {
    const url = `${this.apiUrl}/consultas/${id}`;
    return this.http.get<ConsultaDetailsResponse>(url);
  }

  getConsultaAgendadaById(id: number): Observable<ConsultaDetailsResponse> {
    const url = `${this.apiUrl}/consultas/agendadas/${id}`;
    return this.http.get<ConsultaDetailsResponse>(url);
  }

  updateConsulta(id: number, data: any): Observable<UpdateConsultaResponse> {
    const url = `${this.apiUrl}/consultas/${id}`; 
    return this.http.put<UpdateConsultaResponse>(url, data);
  }

  remarcarConsulta(
    id: number,
    dadosRemarcacao: { data_consulta: string; hora_inicio: string; hora_fim: string }
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/agendadas/${id}/remarcar`, dadosRemarcacao);
  }

  adicionarConsulta(consulta: Consulta): Observable<ConsultaDetailsResponse> {
    return this.http.post<ConsultaDetailsResponse>(`${this.apiUrl}/consultas`, consulta)
      .pipe(
        catchError(this.tratarErro)
      );
  }

  private tratarErro(error: any) {
    console.error('Um erro ocorreu:', error);
    return throwError(() => new Error('Ocorreu um erro ao agendar a consulta. Por favor, tente novamente mais tarde.'));
  }
}