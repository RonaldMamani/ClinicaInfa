import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiBaseUrl = 'http://localhost:8000/api';

  // Observable para o perfil do usuário logado
  private userProfileSubject = new BehaviorSubject<string | null>(null);
  userProfile$ = this.userProfileSubject.asObservable();

  // Observable para o status de login
  // Inicialize com 'false' por padrão para ser seguro com SSR.
  // O estado real será verificado no construtor APENAS se estiver no navegador.
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Injete PLATFORM_ID para verificar o ambiente
  ) {
    // Apenas tente restaurar o estado de login se estiver no navegador
    if (isPlatformBrowser(this.platformId)) {
      const storedToken = localStorage.getItem('access_token');
      const storedProfile = localStorage.getItem('user_profile');

      if (storedToken) {
        this.loggedInSubject.next(true);
      }

      if (storedProfile) {
        this.userProfileSubject.next(storedProfile);
      }
    }
  }

  /**
   * Realiza a autenticação do usuário na API Laravel.
   * @param credentials Objeto com 'username' e 'senha'.
   * @returns Um Observable da resposta da API.
   */
  login(credentials: { username: string, senha: string }): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/login`, credentials).pipe(
      tap(response => {
        // Só armazena o token e atualiza o estado de login se estiver no navegador
        // e se a resposta da API for de sucesso e contiver o token.
        if (isPlatformBrowser(this.platformId) && response && response.status === true && response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          this.loggedInSubject.next(true);

          // Mapeia o id_perfil retornado pela API para uma string de perfil legível.
          const idPerfil = response.usuario?.id_perfil;
          let userProfile: string | null = null;
          switch (idPerfil) {
            case 1:
              userProfile = 'administrador';
              break;
            case 2:
              userProfile = 'medico';
              break;
            case 3: // Supondo que 3 seja o ID para Secretária
              userProfile = 'secretaria';
              break;
            default:
              userProfile = 'desconhecido'; // Caso haja um ID de perfil não mapeado
              break;
          }

          localStorage.setItem('user_profile', userProfile);
          this.userProfileSubject.next(userProfile);
          console.log('Login realizado com sucesso. Perfil:', userProfile);
        } else {
          // Em caso de falha no login ou resposta inesperada, limpa os dados.
          console.error('Login falhou: Resposta inesperada ou token não recebido.', response);
          this.clearAuthData();
        }
      })
    );
  }

  /**
   * Realiza o logout do usuário, invalidando o token no backend (se aplicável)
   * e limpando os dados de autenticação no frontend.
   * @returns Um Observable da resposta da API (ou de sucesso do frontend se o backend falhar).
   */
  logout(): Observable<any> {
    // Envia uma requisição POST para o endpoint de logout da sua API.
    // Mesmo que o backend falhe, o frontend tentará limpar os dados locais.
    return this.http.post<any>(`${this.apiBaseUrl}/logout`, {}).pipe(
      tap(() => {
        this.clearAuthData(); // Chama a função para limpar os dados de autenticação.
        console.log('Logout realizado com sucesso no frontend.');
      },
      error => {
        // Se houver um erro na requisição de logout para o backend, ainda assim limpamos os dados do frontend.
        console.warn('Erro ao deslogar no backend, mas dados do frontend foram limpos.', error);
        this.clearAuthData();
      })
    );
  }

  /**
   * Limpa todos os dados de autenticação do usuário no localStorage
   * e atualiza o estado de login no serviço. Redireciona para a tela de login.
   */
  private clearAuthData(): void {
    console.log('1. clearAuthData() chamada.');

    if (isPlatformBrowser(this.platformId)) {
      console.log('2. Ambiente de navegador detectado. Tentando limpar localStorage.');

      const tokenBefore = localStorage.getItem('access_token');
      const profileBefore = localStorage.getItem('user_profile');
      console.log('3. Token antes da remoção:', tokenBefore);
      console.log('4. Perfil antes da remoção:', profileBefore);

      try {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_profile');
        console.log('5. Tentativa de remoção do localStorage concluída.');
      } catch (e) {
        console.error('ERRO: Falha ao remover itens do localStorage:', e);
      }

      const tokenAfter = localStorage.getItem('access_token');
      const profileAfter = localStorage.getItem('user_profile');
      console.log('6. Token APÓS remoção:', tokenAfter); // Deve ser null
      console.log('7. Perfil APÓS remoção:', profileAfter); // Deve ser null

      if (tokenAfter === null && profileAfter === null) {
        console.log('8. Itens do localStorage aparentemente removidos com sucesso.');
      } else {
        console.error('9. ATENÇÃO: Um ou mais itens do localStorage NÃO foram removidos!');
      }

    } else {
      console.warn('10. NÃO é ambiente de navegador, pulando operação de limpeza do localStorage.');
    }

    // Sempre atualiza os BehaviorSubjects e redireciona, independente do ambiente de execução.
    this.loggedInSubject.next(false);
    this.userProfileSubject.next(null);
    this.router.navigate(['/login']);
    console.log('11. Redirecionando para a página de login.');
  }

  /**
   * Retorna o token de acesso armazenado no localStorage.
   * Retorna null se não houver token ou se não estiver no navegador.
   */
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  /**
   * Retorna um Observable que indica se o usuário está logado.
   */
  isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  /**
   * Retorna um Observable com o perfil do usuário logado.
   */
  getUserProfile(): Observable<string | null> {
    return this.userProfileSubject.asObservable();
  }
}