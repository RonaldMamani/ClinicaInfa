import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AllUsuariosApiResponse, CreateUsuarioPayload, UpdateUsuarioPayload, UsuarioDetailsResponse, UsuarioResponse, UsuariosListResponse } from '../../core/models/usuario.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

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
  getUsuariosAtivos(): Observable<UsuariosListResponse> {
    return this.http.get<UsuariosListResponse>(`${this.apiUrl}/ativos`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtém a lista de usuários INATIVOS, sem paginação.
   * @returns Um Observable com a resposta dos usuários inativos.
   */
  getUsuariosInativos(): Observable<UsuariosListResponse> {
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

  /**
   * Desativa um usuário (delete lógico)
   * Usa a rota DELETE do backend.
   */
  desativarUsuario(id: number): Observable<UsuarioResponse> {
    return this.http
      .delete<UsuarioResponse>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Reativa um usuário.
   * Usa a nova rota PUT do backend.
   */
  reativarUsuario(id: number): Observable<UsuarioResponse> {
    // A nova rota que você criou no `api.php` é /usuarios/{id}/activate
    return this.http
      .put<UsuarioResponse>(`${this.apiUrl}/${id}/activate`, {})
      .pipe(catchError(this.handleError));
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
