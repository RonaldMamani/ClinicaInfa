import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientesPorFuncaoResponse, ConsultasPacienteMensalResponse, ConsultasPorEspecialidadeResponse, ConsultasPorMedicoMesResponse, PacientesPorCidadeResponse, PacientesPorGeneroResponse, ReceitaMensalResponse, ResponsaveisPorCidadeResponse } from '../../core/models/quantidades.model';
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

  getResponsaveisPorCidade(): Observable<ResponsaveisPorCidadeResponse> {
    const url = `${this.apiUrl}/responsaveis-por-cidade`;
    return this.http.get<ResponsaveisPorCidadeResponse>(url);
  }

  getReceitaMensal(): Observable<ReceitaMensalResponse> {
    const url = `${this.apiUrl}/receita-mensal`;
    return this.http.get<ReceitaMensalResponse>(url);
  }

  getConsultasPorEspecialidade(): Observable<ConsultasPorEspecialidadeResponse> {
    const url = `${this.apiUrl}/consultas-por-especialidade`;
    return this.http.get<ConsultasPorEspecialidadeResponse>(url);
  }

  getPacientesPorGenero(): Observable<PacientesPorGeneroResponse> {
    const url = `${this.apiUrl}/pacientes-por-genero`;
    return this.http.get<PacientesPorGeneroResponse>(url);
  }

  getClientesPorFuncao(): Observable<ClientesPorFuncaoResponse> {
    const url = `${this.apiUrl}/clientes-por-funcao`;
    return this.http.get<ClientesPorFuncaoResponse>(url);
  }

  getConsultasPorMedicoPorMes(): Observable<ConsultasPorMedicoMesResponse> {
    const url = `${this.apiUrl}/consultas-por-medico-por-mes`;
    return this.http.get<ConsultasPorMedicoMesResponse>(url);
  }

  getConsultasEAtividadeDePacienteMensal(): Observable<ConsultasPacienteMensalResponse> {
    const url = `${this.apiUrl}/consultas-e-pacientes-mensal`;
    return this.http.get<ConsultasPacienteMensalResponse>(url);
  }
}
