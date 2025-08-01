// src/app/features/secretaria/responsaveis/responsaveis.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponsaveisApiResponse, ResponsavelDetailsResponse, UpdateResponsavelPayload } from '../../core/models/responsavel.model';

@Injectable({
  providedIn: 'root'
})
export class ResponsaveisService {
  private apiBaseUrl = 'http://localhost:8000/api';

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
}