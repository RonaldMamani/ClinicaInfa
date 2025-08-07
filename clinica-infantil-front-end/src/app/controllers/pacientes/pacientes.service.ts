import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Paciente, PacienteDetailsResponse, PacientesApiResponse, UpdatePacientePayload } from '../../core/models/paciente.model';
import { PacientesContagemResponse } from '../../core/models/quantidades.model';


@Injectable({
  providedIn: 'root',
})
export class PacientesService {
  private apiBaseUrl = 'http://localhost:8000/api/pacientes';

  constructor(private http: HttpClient) {}

  getPacientes(): Observable<Paciente[]> {
      return this.http.get<{ pacientes: Paciente[] }>(this.apiBaseUrl).pipe(
        map(response => response.pacientes)
      );
  }

  getPacientesAtivos(): Observable<PacientesApiResponse> {
    return this.http.get<PacientesApiResponse>(`${this.apiBaseUrl}/ativos`);
  }

  getPacienteById(id: number): Observable<PacienteDetailsResponse> {
    return this.http.get<PacienteDetailsResponse>(
      `${this.apiBaseUrl}/${id}`
    );
  }

  updatePaciente( id: number, payload: UpdatePacientePayload ): Observable<PacienteDetailsResponse> {
    return this.http.put<PacienteDetailsResponse>(
      `${this.apiBaseUrl}/${id}`,
      payload
    );
  }

  deletePaciente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseUrl}/${id}`);
  }

  getPacientesInativos(): Observable<PacientesApiResponse> {
    return this.http.get<PacientesApiResponse>(`${this.apiBaseUrl}/inativos`);
  }

  getContagemPacientes(): Observable<PacientesContagemResponse> {
    const url = `${this.apiBaseUrl}/contagem`;
    return this.http.get<PacientesContagemResponse>(url);
  }

}
