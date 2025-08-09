import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClienteDetailsResponse, CreateClientePayload } from '../../core/models/cliente.model';
import { Cidade } from '../../core/models/cidades.model';

export interface CidadesApiResponse {
  status: boolean;
  message: string;
  cidades: Cidade[];
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiBaseUrl = 'http://localhost:8000/api/clientes';

  constructor(private http: HttpClient) { }

  getClienteById(id: number): Observable<ClienteDetailsResponse> {
    return this.http.get<ClienteDetailsResponse>(`${this.apiBaseUrl}/${id}`);
  }

  createCliente(payload: CreateClientePayload): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}`, payload);
  }

}