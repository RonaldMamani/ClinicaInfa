import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface UpdateConsultaResponse {
  status: boolean;
  message: string;
  consulta: any;
}

import { ConsultasApiResponse, ConsultaDetailsResponse, FinalizarConsultaPayload } from '../../core/models/consultas.model';
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

  constructor(private http: HttpClient) {}

  getTodasConsultas(): Observable<ConsultasApiResponse> {
    // Rota correta: /api/consultas/todas
    const url = `${this.apiUrl}`;
    return this.http.get<ConsultasApiResponse>(url);
  }

  getConsultasAgendadas(): Observable<ConsultasApiResponse> {
    const url = `${this.apiUrl}/agendadas`;
    return this.http.get<ConsultasApiResponse>(url);
  }

  getConsultasConcluidas(): Observable<ConsultasApiResponse> {
    const url = `${this.apiUrl}/concluidas`;
    return this.http.get<ConsultasApiResponse>(url);
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

  finalizarConsulta(id: number, payload: FinalizarConsultaPayload): Observable<any> {
    const url = `${this.apiUrl}/${id}/finalizar`;
    return this.http.post<any>(url, payload).pipe(
      catchError(this.handleError)
    );
  }

  concluirConsulta(id: number, data: any): Observable<UpdateConsultaResponse> {
    const url = `${this.apiUrl}/${id}/concluir`;
    return this.http.put<UpdateConsultaResponse>(url, data);
  }

  criarConsulta(dados: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, dados);
  }

  getQuantidadeTodasConsultas(): Observable<QuantidadeTotalResponse> {
    const url = `${this.apiUrl}/quantidades/todas`;
    return this.http.get<QuantidadeTotalResponse>(url);
  }

  getQuantidadeAgendadas(): Observable<QuantidadeAgendadaResponse> {
    const url = `${this.apiUrl}/quantidades/agendadas`;
    return this.http.get<QuantidadeAgendadaResponse>(url);
  }

  getConsultasDoMedico(): Observable<ConsultasApiResponse> {
    const url = `${this.apiUrl}/medico`;
    return this.http.get<ConsultasApiResponse>(url);
  }

  getConsultasDoMedicoAgendados(): Observable<ConsultasApiResponse> {
    const url = `${this.apiUrl}/medico/agendados`;
    return this.http.get<ConsultasApiResponse>(url);
  }

  agendarConsulta(consultaData: any): Observable<any> {
    const url = `${this.apiUrl}/medico/agendar`;
    return this.http.post(url, consultaData);
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

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente ou de rede.
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor.
      errorMessage = `Código do erro: ${error.status}, Mensagem: ${error.error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}