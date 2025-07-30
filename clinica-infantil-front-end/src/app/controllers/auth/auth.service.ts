import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface LoginRequest {
  email: string;
  password: string;
}

// Interface para a resposta de sucesso da API de login
// Ajuste conforme a resposta real da sua API Laravel
export interface LoginResponse {
  status: boolean;
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    // Adicione outras propriedades do usuário que sua API retorna
  };
  authorisation: {
    token: string;
    type: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL da sua API de login. Ajuste conforme a sua rota.
  private readonly API_LOGIN_URL = 'http://localhost:8000/api/auth/login';
  private readonly API_LOGOUT_URL = 'http://localhost:8000/api/auth/logout';
  private readonly API_REFRESH_URL = 'http://localhost:8000/api/auth/refresh';
  private readonly API_USER_URL = 'http://localhost:8000/api/auth/user';

  // BehaviorSubject para gerenciar o estado de autenticação do usuário
  // Isso permite que outros componentes "observem" se o usuário está logado
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) { }

  // Getter para o Observable do estado de login
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  /**
   * Verifica se existe um token no localStorage.
   * @returns boolean - true se houver token, false caso contrário.
   */
  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  /**
   * Envia as credenciais para a API e tenta fazer o login.
   * @param credentials Objeto LoginRequest contendo email e password.
   * @returns Observable<LoginResponse>
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.API_LOGIN_URL, credentials).pipe(
      tap(response => {
        // Se o login for bem-sucedido, armazena o token e atualiza o estado de login
        if (response.status && response.authorisation && response.authorisation.token) {
          localStorage.setItem('access_token', response.authorisation.token);
          this.loggedIn.next(true); // Notifica os observadores que o usuário está logado
        }
      }),
      catchError(this.handleError) // Tratamento de erros
    );
  }

  /**
   * Realiza o logout do usuário.
   * @returns Observable<any>
   */
  logout(): Observable<any> {
    return this.http.post(this.API_LOGOUT_URL, {}).pipe(
      tap(() => {
        localStorage.removeItem('access_token'); // Remove o token
        this.loggedIn.next(false); // Notifica os observadores que o usuário deslogou
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Refreshes the authentication token.
   * @returns Observable<LoginResponse>
   */
  refreshToken(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.API_REFRESH_URL, {}).pipe(
      tap(response => {
        if (response.status && response.authorisation && response.authorisation.token) {
          localStorage.setItem('access_token', response.authorisation.token);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Obtém os dados do usuário logado.
   * @returns Observable<any>
   */
  getUser(): Observable<any> {
    return this.http.post(this.API_USER_URL, {}).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtém o token de acesso armazenado.
   * @returns string | null
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Método privado para tratamento de erros de requisições HTTP.
   * @param error HttpErrorResponse
   * @returns Observable<never>
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente ou de rede
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      errorMessage = `Código do erro: ${error.status}\nMensagem: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = `Erro na API: ${error.error.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}