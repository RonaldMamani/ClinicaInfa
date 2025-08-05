import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ResponsaveisApiResponse, ResponsavelDetailsResponse, UpdateResponsavelPayload } from '../../core/models/responsavel.model';

export interface Estado {
  id: number;
  nome_estado: string;
  sigla: string;
}

export interface Cidade {
  id: number;
  id_estado: number;
  nome_cidade: string;
  estado?: Estado;
}

export interface Genero {
  id: number;
  genero: string;
}

// Cliente agora inclui o relacionamento com Cidade
export interface ClienteResponsavel {
  id: number;
  nome: string;
  cpf: string;
  rg: string;
  ativo: number;
  endereco: string;
  cidade?: Cidade; // Relacionamento com Cidade
  // Adicione outras propriedades do cliente que você usa
}

// Paciente agora inclui o relacionamento com Cliente
export interface PacienteAssociado {
  id: number;
  id_cliente: number;
  data_nascimento: string;
  historico_medico: string;
  cliente?: ClienteResponsavel;
}

// Responsavel agora inclui o relacionamento com Pacientes e Cliente atualizado
export interface Responsavel {
  id: number;
  id_cliente: number;
  grau_parentesco: string;
  email: string;
  telefone: string;
  cliente?: ClienteResponsavel; // Cliente do Responsável
  pacientes?: PacienteAssociado[]; // Pacientes associados ao Responsável
}

export interface PaginatedData<T> {
  current_page: number;
  data: T[];
  last_page: number;
  total: number;
  first_page_url: string;
  from: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
}

export interface FullResponsaveisApiResponse {
  status: boolean;
  message: string;
  responsaveis_ativos: PaginatedData<Responsavel>;
  responsaveis_inativos: PaginatedData<Responsavel>;
}

export interface SingleResponsavelApiResponse {
  status: boolean;
  message: string;
  responsavel: Responsavel;
}

@Injectable({
  providedIn: 'root'
})
export class ResponsaveisService {
  private apiBaseUrl = 'http://localhost:8000/api';
  private apiUrl = 'http://localhost:8000/api/responsaveis';

  constructor(private http: HttpClient) { }

  getResponsaveis(): Observable<ResponsaveisApiResponse> {
    return this.http.get<ResponsaveisApiResponse>(`${this.apiBaseUrl}/responsaveis`);
  }

  getResponsavelById(id: number): Observable<ResponsavelDetailsResponse> {
    return this.http.get<ResponsavelDetailsResponse>(`${this.apiBaseUrl}/responsaveis/${id}`);
  }

  updateResponsavel(id: number, payload: UpdateResponsavelPayload): Observable<ResponsavelDetailsResponse> {
    return this.http.put<ResponsavelDetailsResponse>(`${this.apiBaseUrl}/responsaveis/${id}`, payload);
  }

  deleteResponsavel(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseUrl}/responsaveis/${id}`);
  }


  //pagina admin
  getTodosResponsaveis(activePage: number = 1, inactivePage: number = 1): Observable<FullResponsaveisApiResponse> {
    let params = new HttpParams()
      .set('active_page', activePage.toString())
      .set('inactive_page', inactivePage.toString());

    return this.http.get<FullResponsaveisApiResponse>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getResponsavelDetalhes(id: number): Observable<SingleResponsavelApiResponse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<SingleResponsavelApiResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  updateResponsavelStatus(id: number, ativo: boolean): Observable<any> {
    const url = `${this.apiUrl}/${id}/status`;
    return this.http.put<any>(url, { ativo }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Erro na API de Responsáveis:', error);
    let errorMessage = 'Ocorreu um erro ao carregar os responsáveis.';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}