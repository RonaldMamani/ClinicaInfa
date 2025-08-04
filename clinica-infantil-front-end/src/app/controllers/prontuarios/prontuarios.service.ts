import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProntuariosService {
  private apiUrl = 'http://localhost:8000/api/prontuarios';

  constructor(private http: HttpClient) { }

  getTodosProntuarios(): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        return throwError(() => new Error(error.error.message || 'Erro ao carregar prontuários.'));
      })
    );
  }

  /**
   * Verifica se um paciente já tem um prontuário.
   * @param pacienteId O ID do paciente.
   * @returns Um Observable com a resposta da API.
   */
  checkProntuario(pacienteId: number): Observable<any> {
    const url = `${this.apiUrl}/paciente/${pacienteId}/check`;
    return this.http.get<any>(url);
  }

  getProntuarioDetalhes(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        return throwError(() => new Error(error.error.message || 'Erro ao carregar detalhes do prontuário.'));
      })
    );
  }

  getProntuarioByPacienteId(pacienteId: number): Observable<any> {
    const url = `${this.apiUrl}/paciente/${pacienteId}`;
    return this.http.get<any>(url).pipe(
      // Se a API retornar 404 (Prontuário não encontrado), tratamos como sucesso
      // para não quebrar o fluxo de inicialização do componente.
      // O componente irá verificar se a resposta tem um prontuário ou não.
      catchError(error => {
        if (error.status === 404) {
          console.log('Prontuário não encontrado para este paciente. (Isso é esperado para novos pacientes)');
          return new Observable(observer => observer.next({ prontuario: null }));
        }
        return throwError(() => new Error(error.error.message || 'Erro ao buscar prontuário.'));
      })
    );
  }
}
