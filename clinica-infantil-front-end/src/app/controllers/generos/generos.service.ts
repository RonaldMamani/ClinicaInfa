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
}