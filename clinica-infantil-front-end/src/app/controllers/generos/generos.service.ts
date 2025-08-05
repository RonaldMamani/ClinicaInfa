// src/app/controllers/generos/generos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Genero, GeneroApiResponse } from '../../core/models/generos.model';

export interface GenerosApiResponse {
  status: boolean;
  message: string;
  generos: Genero[];
}

@Injectable({
  providedIn: 'root'
})
export class GenerosService {
  private apiUrl = 'http://localhost:8000/api/generos';

  constructor(private http: HttpClient) { }

  getGeneros(): Observable<GeneroApiResponse> {
    return this.http.get<GeneroApiResponse>(this.apiUrl);
  }

  getGenerosAtual(): Observable<Genero[]> {
    return this.http.get<GenerosApiResponse>(`${this.apiUrl}/get`).pipe(
      map(response => response.generos),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Erro na API de Gêneros:', error);
    let errorMessage = 'Ocorreu um erro ao carregar os gêneros.';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}