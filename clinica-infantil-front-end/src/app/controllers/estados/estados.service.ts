// src/app/estados.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interface que representa a estrutura de um único objeto Estado
export interface Estado {
  id: number;
  nome_estado: string;
  sigla: string;
}

// Interface que representa a estrutura completa da resposta da API de estados
export interface ApiResponseEstados {
  status: boolean;
  estados: Estado[];
}

@Injectable({
  providedIn: 'root'
})
export class EstadosService {
  private readonly API_URL = 'http://localhost:8000/api/estados';

  constructor(private http: HttpClient) { }

  getEstados(): Observable<Estado[]> {
    return this.http.get<ApiResponseEstados>(this.API_URL).pipe(
      map(response => response.estados)
    );
  }
}