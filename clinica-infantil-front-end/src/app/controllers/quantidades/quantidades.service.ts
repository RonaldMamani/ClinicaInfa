import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  PacientesContagemResponse,
  QuantidadeAgendadaResponse,
  QuantidadeTotalResponse,
} from '../../core/models/quantidades.model';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuantidadesService {
  private apiUrl = 'http://localhost:8000/api/quantidades';

  constructor(private http: HttpClient) {}

  getQuantidadeTodasConsultas(): Observable<QuantidadeTotalResponse> {
    const url = `${this.apiUrl}/consultas/todas`;
    return this.http.get<QuantidadeTotalResponse>(url);
  }

  getQuantidadeAgendadas(): Observable<QuantidadeAgendadaResponse> {
    const url = `${this.apiUrl}/consultas/agendadas`;
    return this.http.get<QuantidadeAgendadaResponse>(url);
  }

  getTotalConsultasMedico(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/medico/consultas`).pipe(
      map((response) => response.total_consultas),
      catchError((error) => { return throwError( () =>
            new Error(error.error?.message || 'Erro ao obter a contagem total de consultas.')
        );
      })
    );
  }

  getProximasConsultasMedico(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/medico/agendadas`).pipe(
      map((response) => response.consultas_agendadas),
      catchError((error) => {
        return throwError(
          () =>
            new Error(error.error?.message ||'Erro ao obter a contagem de consultas agendadas.')
        );
      })
    );
  }

  getQuantidadePacientes(): Observable<PacientesContagemResponse> {
      const url = `${this.apiUrl}/pacientes`;
      return this.http.get<PacientesContagemResponse>(url);
  }
}
