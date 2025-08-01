import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of, map } from 'rxjs';
import { Router } from '@angular/router';
import { LoginResponse, UsuarioDetailsResponse } from '../../core/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiBaseUrl = 'http://localhost:8000/api';

  private userProfileSubject = new BehaviorSubject<string | null>(null);
  userProfile$ = this.userProfileSubject.asObservable();

  private userNameSubject = new BehaviorSubject<string | null>(null);
  userName$ = this.userNameSubject.asObservable();

  private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const storedToken = localStorage.getItem('access_token');
      const storedProfile = localStorage.getItem('user_profile');
      const storedName = localStorage.getItem('user_name');

      if (storedToken) {
        this.loggedInSubject.next(true);
      }
      if (storedProfile) {
        this.userProfileSubject.next(storedProfile);
      }
      if (storedName) {
        this.userNameSubject.next(storedName);
      }
    }
  }

  login(credentials: { username: string, senha: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiBaseUrl}/login`, credentials).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId) && response && response.status === true && response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          this.loggedInSubject.next(true);

          const idPerfil = response.usuario?.id_perfil;
          let userProfile: string | null = null;
          switch (idPerfil) {
            case 1: userProfile = 'administrador'; break;
            case 2: userProfile = 'medico'; break;
            case 3: userProfile = 'secretaria'; break;
            default: userProfile = 'desconhecido'; break;
          }
          localStorage.setItem('user_profile', userProfile);
          this.userProfileSubject.next(userProfile);

          const idFuncionario = response.usuario?.id_funcionario;
          if (idFuncionario) {
            this.fetchUserName(idFuncionario).subscribe({ // Usamos subscribe aqui para lidar com a requisição de nome
              next: name => {
                if (name) {
                  localStorage.setItem('user_name', name);
                  this.userNameSubject.next(name);
                  console.log('Nome do funcionário obtido e salvo:', name);
                }
              },
              error: err => console.error('Erro ao buscar nome do funcionário:', err)
            });
          } else {
            localStorage.removeItem('user_name');
            this.userNameSubject.next(null);
          }
          console.log('Login realizado com sucesso. Perfil:', userProfile);
        } else {
          console.error('Login falhou: Resposta inesperada ou token não recebido.', response);
          this.clearAuthData();
        }
      })
    );
  }

  private fetchUserName(id: number): Observable<string | null> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(null);
    }
    return this.http.get<UsuarioDetailsResponse>(`${this.apiBaseUrl}/usuarios/${id}`).pipe(
      map(response => {
        if (response && response.usuario && response.usuario.funcionario && response.usuario.funcionario.nome) {
          return response.usuario.funcionario.nome;
        }
        return null;
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/logout`, {}).pipe(
      tap(() => {
        this.clearAuthData();
        console.log('Logout realizado com sucesso no frontend.');
      },
      error => {
        console.warn('Erro ao deslogar no backend, mas dados do frontend foram limpos.', error);
        this.clearAuthData();
      })
    );
  }

  private clearAuthData(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_profile');
      localStorage.removeItem('user_name');
      console.log('Dados de autenticação limpos do localStorage.');
    } else {
      console.warn('Não é ambiente de navegador, pulando limpeza do localStorage.');
    }

    this.loggedInSubject.next(false);
    this.userProfileSubject.next(null);
    this.userNameSubject.next(null);
    this.router.navigate(['/login']);
    console.log('Redirecionando para a página de login.');
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  getUserProfile(): Observable<string | null> {
    return this.userProfileSubject.asObservable();
  }

  getUserName(): Observable<string | null> {
    return this.userNameSubject.asObservable();
  }
}