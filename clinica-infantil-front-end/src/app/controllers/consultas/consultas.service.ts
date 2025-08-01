import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UpdateConsultaResponse {
  status: boolean;
  message: string;
  consulta: any;
}

import { ConsultasApiResponse, ConsultasAgendadasApiResponse, ConsultaDetailsResponse } from '../../core/models/consultas.model';

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
    // Rota correta: /api/consultas/agendadas
    const url = `${this.apiUrl}/consultas/agendadas`;
    return this.http.get<ConsultasAgendadasApiResponse>(url);
  }

  getConsultaById(id: number): Observable<ConsultaDetailsResponse> {
    const url = `${this.apiUrl}/consultas/${id}`;
    return this.http.get<ConsultaDetailsResponse>(url);
  }

  updateConsulta(id: number, data: any): Observable<UpdateConsultaResponse> {
  const url = `${this.apiUrl}/consultas/${id}`; 
  return this.http.put<UpdateConsultaResponse>(url, data);
}
}