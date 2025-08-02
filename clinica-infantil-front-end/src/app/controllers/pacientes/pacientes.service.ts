import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PacienteDetailsResponse, PacientesApiResponse, PatientsCountResponse, UpdatePacientePayload } from '../../core/models/paciente.model';


@Injectable({
  providedIn: 'root',
})
export class PacientesService {
  private apiBaseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getPacientes(): Observable<PacientesApiResponse> {
    return this.http.get<PacientesApiResponse>(`${this.apiBaseUrl}/pacientes`);
  }

  getPacienteById(id: number): Observable<PacienteDetailsResponse> {
    return this.http.get<PacienteDetailsResponse>(
      `${this.apiBaseUrl}/pacientes/${id}`
    );
  } 

  updatePaciente(
    id: number,
    payload: UpdatePacientePayload
  ): Observable<PacienteDetailsResponse> {
    return this.http.put<PacienteDetailsResponse>(
      `${this.apiBaseUrl}/pacientes/${id}`,
      payload
    );
  }

  deletePaciente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseUrl}/pacientes/${id}`);
  }

  getPatientsCount(): Observable<PatientsCountResponse> {
    return this.http.get<PatientsCountResponse>(`${this.apiBaseUrl}/pacientes/contagem`);
  }
  
  getActivePatients(): Observable<PacientesApiResponse> {
    return this.http.get<PacientesApiResponse>(`${this.apiBaseUrl}/pacientes/ativos`);
  }

  getInactivePatients(): Observable<PacientesApiResponse> {
    return this.http.get<PacientesApiResponse>(`${this.apiBaseUrl}/pacientes/inativos`);
  }

}
