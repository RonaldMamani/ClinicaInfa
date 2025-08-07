import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AllUsuariosApiResponse, CreateUsuarioPayload, UpdateUsuarioPayload, UsuarioDetailsResponse, UsuariosListResponse } from '../../core/models/usuario.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Funcionario } from '../../core/models/funcionario.model';
import { Perfil } from '../../core/models/perfil.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = 'http://localhost:8000/api/usuarios';

  constructor(private http: HttpClient) { }

  /**
   * Obtém a lista de usuários ATIVOS, sem paginação.
   * @returns Um Observable com a resposta dos usuários ativos.
   */
  getActiveUsuarios(): Observable<UsuariosListResponse> {
    return this.http.get<UsuariosListResponse>(`${this.apiUrl}/ativos`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtém a lista de usuários INATIVOS, sem paginação.
   * @returns Um Observable com a resposta dos usuários inativos.
   */
  getInactiveUsuarios(): Observable<UsuariosListResponse> {
    return this.http.get<UsuariosListResponse>(`${this.apiUrl}/inativos`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtém os detalhes de um usuário específico pelo ID.
   * @param id O ID do usuário.
   * @returns Um Observable com os detalhes do usuário.
   */
  getUsuarioDetalhes(id: number): Observable<UsuarioDetailsResponse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<UsuarioDetailsResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  createUsuario(payload: CreateUsuarioPayload): Observable<UsuarioDetailsResponse> {
    return this.http.post<UsuarioDetailsResponse>(this.apiUrl, payload).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Atualiza os dados de um usuário e suas relações (funcionário, médico).
   * @param id O ID do usuário a ser atualizado.
   * @param payload Os dados atualizados do usuário, funcionário e médico.
   * @returns Um Observable com a resposta da API.
   */
  updateUsuario(id: number, payload: UpdateUsuarioPayload): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, payload).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro na API de Usuários:', error);
    let errorMessage = 'Ocorreu um erro ao carregar os usuários.';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}
