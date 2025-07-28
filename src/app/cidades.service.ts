// src/app/cidades.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interface para um único objeto Cidade
export interface Cidade {
  id: number;
  id_estado: number;
  nome_cidade: string;
}

// Interface para a resposta completa da API de cidades
export interface ApiResponseCidades {
  status: boolean;
  message: string;
  cidades: Cidade[];
}

@Injectable({
  providedIn: 'root'
})
export class CidadesService {
  private readonly API_BASE_URL = 'http://localhost:8000/api/estados';

  constructor(private http: HttpClient) { }

  getCidadesPorEstado(idEstado: number): Observable<Cidade[]> {
    const url = `${this.API_BASE_URL}/${idEstado}/cidades`;
    
    return this.http.get<ApiResponseCidades>(url).pipe(
      map(response => response.cidades)
    );
  }
}