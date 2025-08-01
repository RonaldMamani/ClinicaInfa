import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseResponsaveis, ResponsavelDetailsResponse, Responsavel, UpdateResponsavelPayload } from '../../core/models/responsavel.model'; // Ajuste o caminho

@Injectable({
  providedIn: 'root'
})
export class ResponsaveisService {
  private apiBaseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getResponsaveis(): Observable<ApiResponseResponsaveis> {
    return this.http.get<ApiResponseResponsaveis>(`${this.apiBaseUrl}/responsaveis`);
  }

  getResponsavelById(id: number): Observable<ResponsavelDetailsResponse> {
    return this.http.get<ResponsavelDetailsResponse>(`${this.apiBaseUrl}/responsaveis/${id}`);
  }

  updateResponsavel(id: number, payload: UpdateResponsavelPayload): Observable<ResponsavelDetailsResponse> {
    return this.http.put<ResponsavelDetailsResponse>(`${this.apiBaseUrl}/responsaveis/${id}`, payload);
  }

}
