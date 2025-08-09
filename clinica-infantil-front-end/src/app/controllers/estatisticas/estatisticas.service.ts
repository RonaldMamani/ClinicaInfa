import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PacientesPorCidadeResponse, ReceitaMensalResponse } from '../../core/models/quantidades.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstatisticasService {

  private apiUrl = 'http://localhost:8000/api/estatisticas';

  constructor(private http: HttpClient) {}

  getPacientesPorCidade(): Observable<PacientesPorCidadeResponse> {
    const url = `${this.apiUrl}/pacientes-por-cidade`;
    return this.http.get<PacientesPorCidadeResponse>(url);
  }

  getReceitaMensal(): Observable<ReceitaMensalResponse> {
    const url = `${this.apiUrl}/receita-mensal`;
    return this.http.get<ReceitaMensalResponse>(url);
  }
}
