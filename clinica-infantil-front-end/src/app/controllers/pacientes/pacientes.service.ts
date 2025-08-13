import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Paciente, PacienteDetailsResponse, PacientesApiResponse, PacientesPaginadosResponse, UpdatePacientePayload } from '../../core/models/paciente.model';
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

  getPacientesPaginados(page: number = 1, ativo?: boolean): Observable<PacientesPaginadosResponse> {
    let params = new HttpParams().set('page', page.toString());

    if (ativo !== undefined) {
      params = params.set('ativo', ativo.toString());
    }

    return this.http.get<PacientesPaginadosResponse>(`${this.apiBaseUrl}/paginacao`, { params });
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
}
