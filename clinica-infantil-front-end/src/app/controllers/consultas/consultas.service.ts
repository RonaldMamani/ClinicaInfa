import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface UpdateConsultaResponse {
  status: boolean;
  message: string;
  consulta: any;
}

import { ConsultasApiResponse, ConsultaDetailsResponse, FinalizarConsultaPayload, ConsultasPaginationApiResponse } from '../../core/models/consultas.model';
import { QuantidadeAgendadaResponse, QuantidadeTotalResponse, TodasEstatisticasResponse } from '../../core/models/quantidades.model';

@Injectable({
  providedIn: 'root'
})

export class ConsultasService {
  // Use a URL base do seu backend diretamente, sem o arquivo de environment
  private apiUrl = 'http://localhost:8000/api/consultas';

  constructor(private http: HttpClient) {}

  getTodasConsultas(): Observable<ConsultasApiResponse> {
    // Rota correta: /api/consultas/todas
    const url = `${this.apiUrl}`;
    return this.http.get<ConsultasApiResponse>(url);
  }

  getConsultasListar(page: number = 1): Observable<ConsultasPaginationApiResponse> {
    const url = `${this.apiUrl}/listar?page=${page}`;
    return this.http.get<ConsultasPaginationApiResponse>(url);
  }

  getConsultasAgendadasListar(page: number = 1): Observable<ConsultasPaginationApiResponse> {
    const url = `${this.apiUrl}/listar-agendadas?page=${page}`;
    return this.http.get<ConsultasPaginationApiResponse>(url);
  }

  getConsultasAgendadas(): Observable<ConsultasApiResponse> {
    const url = `${this.apiUrl}/agendadas`;
    return this.http.get<ConsultasApiResponse>(url);
  }

  getConsultasConcluidas(): Observable<ConsultasApiResponse> {
    const url = `${this.apiUrl}/concluidas`;
    return this.http.get<ConsultasApiResponse>(url);
  }

  getConsultasDoMedico(pageUrl: string | null = null): Observable<any> {
    // Se uma URL de paginação for fornecida, use-a. Senão, use a URL padrão.
    const url = pageUrl ? pageUrl : `${this.apiUrl}/medico`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }

 getConsultasDoMedicoAgendadas(pageUrl: string | null = null): Observable<any> {
    const url = pageUrl ? pageUrl : `${this.apiUrl}/medico/agendados`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  getConsultaById(id: number): Observable<ConsultaDetailsResponse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ConsultaDetailsResponse>(url);
  }

  getConsultaAgendadaById(id: number): Observable<ConsultaDetailsResponse> {
    const url = `${this.apiUrl}/agendadas/${id}`;
    return this.http.get<ConsultaDetailsResponse>(url);
  }

  agendarConsulta(consultaData: any): Observable<any> {
    const url = `${this.apiUrl}/medico/agendar`;
    return this.http.post(url, consultaData);
  }

  updateConsulta(id: number, data: any): Observable<UpdateConsultaResponse> {
    const url = `${this.apiUrl}/${id}`; 
    return this.http.put<UpdateConsultaResponse>(url, data);
  }

  remarcarConsulta( id: number, dadosRemarcacao: { data_consulta: string; hora_inicio: string; hora_fim: string }): Observable<any> {
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

  getTodasEstatisticas(): Observable<TodasEstatisticasResponse> {
    const url = `${this.apiUrl}/estatisticas`;
    return this.http.get<TodasEstatisticasResponse>(url);
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