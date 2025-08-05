import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  ApiResponseClientes,
  ClienteDetailsResponse,
  UpdateClientePayload,
  CreateClientePayload
} from '../../core/models/cliente.model';
import {
  ResponsaveisApiResponse,
  ResponsavelComCliente,
  ResponsavelDetailsResponse
} from '../../core/models/responsavel.model';
import { PacienteDetailsResponse, PacientesApiResponse, UpdatePacientePayload } from '../../core/models/paciente.model';
import { Cidade } from '../responsaveis/responsaveis.service';

export interface CidadesApiResponse {
  status: boolean;
  message: string;
  cidades: Cidade[];
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiBaseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getClientes(): Observable<ApiResponseClientes> {
    return this.http.get<ApiResponseClientes>(`${this.apiBaseUrl}/clientes`);
  }

  getClienteById(id: number): Observable<ClienteDetailsResponse> {
    return this.http.get<ClienteDetailsResponse>(`${this.apiBaseUrl}/clientes/${id}`);
  }

  getResponsaveis(): Observable<ResponsavelComCliente[]> {
    return this.http.get<ResponsaveisApiResponse>(`${this.apiBaseUrl}/responsaveis`).pipe(
      map(response => response.responsaveis)
    );
  }

  getResponsavelById(id: number): Observable<ResponsavelDetailsResponse> {
    return this.http.get<ResponsavelDetailsResponse>(`${this.apiBaseUrl}/responsaveis/${id}`);
  }

  updateCliente(id: number, payload: UpdateClientePayload): Observable<ClienteDetailsResponse> {
    return this.http.put<ClienteDetailsResponse>(`${this.apiBaseUrl}/clientes/${id}`, payload);
  }

  createCliente(payload: CreateClientePayload): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/clientes`, payload);
  }

  getPacientes(): Observable<PacientesApiResponse> {
    return this.http.get<PacientesApiResponse>(`${this.apiBaseUrl}/pacientes`);
  }

  getPacienteById(id: number): Observable<PacienteDetailsResponse> {
    return this.http.get<PacienteDetailsResponse>(`${this.apiBaseUrl}/pacientes/${id}`);
  }

  updatePaciente(id: number, payload: UpdatePacientePayload): Observable<PacienteDetailsResponse> {
    return this.http.put<PacienteDetailsResponse>(`${this.apiBaseUrl}/pacientes/${id}`, payload);
  }
}