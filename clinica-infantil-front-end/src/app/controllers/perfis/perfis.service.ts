import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Perfil } from '../../core/models/perfil.model';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfisService {

  private apiPerfisUrl = 'http://localhost:8000/api/perfis';

  constructor(private http: HttpClient) { }

  /**
   * Obtém a lista de todos os perfis.
   * CORRIGIDO: Agora mapeia a resposta da API para extrair o array de 'perfis'.
   * @returns Um Observable com um array de Perfis.
   */
  getPerfis(): Observable<Perfil[]> {
      // A API retorna um objeto como {status: true, message: '...', perfis: []}
      return this.http.get<{ status: boolean; message: string; perfis: Perfil[] }>(this.apiPerfisUrl).pipe(
        map(response => response.perfis), // Extrai apenas o array 'perfis'
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
