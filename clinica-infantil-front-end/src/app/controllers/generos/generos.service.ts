// src/app/controllers/generos/generos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneroApiResponse } from '../../core/models/generos.model';

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