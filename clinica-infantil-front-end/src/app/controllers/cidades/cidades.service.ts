import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Cidade } from '../../core/models/cliente.model';
import { ApiResponseCidades } from '../../core/models/cidades.model';

export interface CidadesApiResponse {
  status: boolean;
  message: string;
  cidades: Cidade[];
}

@Injectable({
  providedIn: 'root'
})
export class CidadesService {
  private readonly API_BASE_URL = 'http://localhost:8000/api/estados';
  private apiUrl = 'http://localhost:8000/api/cidades';

  constructor(private http: HttpClient) { }

  getCidadesPorEstado(idEstado: number): Observable<Cidade[]> {
    const url = `${this.API_BASE_URL}/${idEstado}/cidades`;
    
    return this.http.get<ApiResponseCidades>(url).pipe(
      map(response => response.cidades)
    );
  }

  getCidades(): Observable<Cidade[]> {
    return this.http.get<CidadesApiResponse>(this.apiUrl).pipe(
      map(response => response.cidades),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Erro na API de Cidades:', error);
    let errorMessage = 'Ocorreu um erro ao carregar as cidades.';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}