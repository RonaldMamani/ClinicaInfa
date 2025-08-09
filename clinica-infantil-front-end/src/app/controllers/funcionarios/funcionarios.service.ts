import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Funcionario } from '../../core/models/funcionario.model';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FuncionariosService {

  private apiFuncionariosUrl = 'http://localhost:8000/api/funcionarios';

  constructor(private http: HttpClient) { }

  /**
   * Obtém a lista de todos os funcionários.
   * @returns Um Observable com um array de Funcionarios.
   */
  getFuncionarios(): Observable<Funcionario[]> {
    // A API retorna um objeto como {status: true, message: '...', funcionarios: []}
    return this.http.get<{ status: boolean; message: string; funcionarios: Funcionario[] }>(this.apiFuncionariosUrl).pipe(
      map(response => response.funcionarios), // Extrai apenas o array 'funcionarios'
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
