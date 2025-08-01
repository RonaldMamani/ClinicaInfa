import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponsePacientes, PacienteDetailsResponse, UpdatePacientePayload, Paciente } from '../../core/models/paciente.model'; // Ajuste imports

@Injectable({
  providedIn: 'root'
})
export class PacientesService {
  private apiBaseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getPacientes(): Observable<ApiResponsePacientes> {
    return this.http.get<ApiResponsePacientes>(`${this.apiBaseUrl}/pacientes`);
  }

  /**
   * Obtém os detalhes de um paciente específico pelo ID.
   * @param id O ID do paciente.
   * @returns Um Observable com a resposta da API contendo os detalhes do paciente.
   */
  getPacienteById(id: number): Observable<PacienteDetailsResponse> {
    return this.http.get<PacienteDetailsResponse>(`${this.apiBaseUrl}/pacientes/${id}`);
  }

  /**
   * Atualiza os dados de um paciente existente.
   * @param id O ID do paciente a ser atualizado.
   * @param payload Os dados do paciente a serem enviados no corpo da requisição PUT.
   * @returns Um Observable com a resposta da API após a atualização.
   */
  updatePaciente(id: number, payload: UpdatePacientePayload): Observable<PacienteDetailsResponse> {
    return this.http.put<PacienteDetailsResponse>(`${this.apiBaseUrl}/pacientes/${id}`, payload);
  }

  // Você pode adicionar um método deletePaciente aqui também
  deletePaciente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseUrl}/pacientes/${id}`);
  }
}