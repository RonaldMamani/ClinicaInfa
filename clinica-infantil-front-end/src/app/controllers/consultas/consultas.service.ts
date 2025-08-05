import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface UpdateConsultaResponse {
  status: boolean;
  message: string;
  consulta: any;
}

import { ConsultasApiResponse, ConsultasAgendadasApiResponse, ConsultaDetailsResponse, Consulta } from '../../core/models/consultas.model';
import { Paciente, PacientesApiResponse } from '../../core/models/paciente.model';
import { Medico } from '../../core/models/medico.model';
import { QuantidadeAgendadaResponse, QuantidadeTotalResponse } from '../../core/models/quantidades.model';

@Injectable({
  providedIn: 'root'
})

export class ConsultasService {
  // Use a URL base do seu backend diretamente, sem o arquivo de environment
  private originApiUrl = 'http://localhost:8000/api';
  private apiUrl = 'http://localhost:8000/api/consultas';
  private pacientesApiUrl = 'http://localhost:8000/api/pacientes';
  private medicosApiUrl = 'http://localhost:8000/api/medicos';

  constructor(private http: HttpClient) {}

  getTodasConsultas(): Observable<ConsultasApiResponse> {
    // Rota correta: /api/consultas/todas
    const url = `${this.apiUrl}`;
    return this.http.get<ConsultasApiResponse>(url);
  }

  getConsultasAgendadas(): Observable<ConsultasAgendadasApiResponse> {
    const url = `${this.apiUrl}/agendadas`;
    return this.http.get<ConsultasAgendadasApiResponse>(url);
  }

  getConsultaById(id: number): Observable<ConsultaDetailsResponse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ConsultaDetailsResponse>(url);
  }

  getConsultaAgendadaById(id: number): Observable<ConsultaDetailsResponse> {
    const url = `${this.apiUrl}/agendadas/${id}`;
    return this.http.get<ConsultaDetailsResponse>(url);
  }

  updateConsulta(id: number, data: any): Observable<UpdateConsultaResponse> {
    const url = `${this.apiUrl}/${id}`; 
    return this.http.put<UpdateConsultaResponse>(url, data);
  }

  remarcarConsulta(
    id: number,
    dadosRemarcacao: { data_consulta: string; hora_inicio: string; hora_fim: string }
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/agendadas/${id}/remarcar`, dadosRemarcacao);
  }

  cancelarConsulta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  criarConsulta(dados: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, dados);
  }

  getPacientes(): Observable<Paciente[]> {
    return this.http.get<{ pacientes: Paciente[] }>(this.pacientesApiUrl).pipe(
      map(response => response.pacientes)
    );
  }

  getMedicos(): Observable<Medico[]> {
    return this.http.get<{ medicos: Medico[] }>(this.medicosApiUrl).pipe(
      map(response => response.medicos)
    );
  }

  getQuantidadeTodasConsultas(): Observable<QuantidadeTotalResponse> {
    const url = `${this.apiUrl}/quantidades/todas`;
    return this.http.get<QuantidadeTotalResponse>(url);
  }

  getQuantidadeAgendadas(): Observable<QuantidadeAgendadaResponse> {
    const url = `${this.apiUrl}/quantidades/agendadas`;
    return this.http.get<QuantidadeAgendadaResponse>(url);
  }

  getConsultasDoMedico(): Observable<ConsultasAgendadasApiResponse> {
    const url = `${this.apiUrl}/medico`;
    return this.http.get<ConsultasAgendadasApiResponse>(url);
  }

  getConsultasDoMedicoAgendados(): Observable<ConsultasAgendadasApiResponse> {
    const url = `${this.apiUrl}/medico/agendados`;
    return this.http.get<ConsultasAgendadasApiResponse>(url);
  }

  agendarConsulta(consultaData: any): Observable<any> {
    const url = `${this.apiUrl}/medico/agendar`;
    return this.http.post(url, consultaData);
  }

  getPacientesAgendar(): Observable<PacientesApiResponse> {
    return this.http.get<PacientesApiResponse>(`${this.pacientesApiUrl}/ativos`);
  }

  getTotalConsultasCount(): Observable<number> {
    return this.http.get<any>(`${this.originApiUrl}/medico/consultas/count/total`).pipe(
      map(response => response.total_consultas),
      catchError(error => {
        return throwError(() => new Error(error.error?.message || 'Erro ao obter a contagem total de consultas.'));
      })
    );
  }

  getProximasConsultasCount(): Observable<number> {
    return this.http.get<any>(`${this.originApiUrl}/medico/consultas/count/agendadas`).pipe(
      map(response => response.consultas_agendadas),
      catchError(error => {
        return throwError(() => new Error(error.error?.message || 'Erro ao obter a contagem de consultas agendadas.'));
      })
    );
  }

  concluirConsulta(id: number, data: any): Observable<UpdateConsultaResponse> {
    const url = `${this.apiUrl}/${id}/concluir`;
    return this.http.put<UpdateConsultaResponse>(url, data);
  }
}