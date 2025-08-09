import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ResponsaveiPaginateResponse, ResponsaveisApiResponse, ResponsavelDetailsResponse } from '../../core/models/responsavel.model';

@Injectable({
  providedIn: 'root'
})
export class ResponsaveisService {
  private apiUrl = 'http://localhost:8000/api/responsaveis';

  constructor(private http: HttpClient) { }

  getResponsaveisPaginados(page: number = 1, status: boolean | undefined = undefined): Observable<ResponsaveiPaginateResponse> {
    let params = new HttpParams().set('page', page.toString());

    // Adiciona o parâmetro 'status' apenas se ele for fornecido
    if (status !== undefined) {
      params = params.set('status', status.toString());
    }

    return this.http.get<ResponsaveiPaginateResponse>(`${this.apiUrl}/listar`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getTodosResponsaveisAtivos(): Observable<ResponsaveisApiResponse> {
    return this.http.get<ResponsaveisApiResponse>(`${this.apiUrl}/ativos`);
  }

  updateResponsavel(id: number, data: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, data).pipe(
      catchError(this.handleError)
    );
  }

  deleteResponsavel(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getResponsaveisAtivosPaginados(page: number = 1, perPage: number = 10): Observable<ResponsaveiPaginateResponse> {
    let params = new HttpParams().set('page', page.toString()).set('per_page', perPage.toString());
    return this.http.get<ResponsaveiPaginateResponse>(`${this.apiUrl}/page-ativos`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getResponsaveisInativosPaginados(page: number = 1, perPage: number = 10): Observable<ResponsaveiPaginateResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    return this.http.get<ResponsaveiPaginateResponse>(`${this.apiUrl}/page-inativos`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getResponsavelDetalhes(id: number): Observable<ResponsavelDetailsResponse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ResponsavelDetailsResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  updateResponsavelStatus(id: number, ativo: boolean): Observable<any> {
    const url = `${this.apiUrl}/${id}/status`;
    return this.http.put<any>(url, { ativo }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Erro na API de Responsáveis:', error);
    let errorMessage = 'Ocorreu um erro ao carregar os responsáveis.';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}