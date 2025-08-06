import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { FullResponsaveisApiResponse, ResponsaveisApiResponse, Responsavel, ResponsavelApiResponse, ResponsavelDetailsResponse, SingleResponsavelApiResponse, UpdateResponsavelPayload } from '../../core/models/responsavel.model';

@Injectable({
  providedIn: 'root'
})
export class ResponsaveisService {
  private apiBaseUrl = 'http://localhost:8000/api';
  private apiUrl = 'http://localhost:8000/api/responsaveis';

  constructor(private http: HttpClient) { }

  getTodosResponsaveisAtivos(): Observable<ResponsaveisApiResponse> {
    return this.http.get<ResponsaveisApiResponse>(`${this.apiUrl}/ativos`);
  }

  getResponsavelById(id: number): Observable<ResponsavelDetailsResponse> {
    return this.http.get<ResponsavelDetailsResponse>(`${this.apiBaseUrl}/responsaveis/${id}`);
  }

  updateResponsavel(id: number, data: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, data).pipe(
      catchError(this.handleError)
    );
  }

  deleteResponsavel(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseUrl}/responsaveis/${id}`);
  }


  //pagina admin
  getTodosResponsaveis(activePage: number = 1, inactivePage: number = 1): Observable<FullResponsaveisApiResponse> {
    let params = new HttpParams()
      .set('active_page', activePage.toString())
      .set('inactive_page', inactivePage.toString());

    return this.http.get<FullResponsaveisApiResponse>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getResponsaveisAtivosPaginados(page: number = 1, perPage: number = 10): Observable<ResponsavelApiResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    return this.http.get<ResponsavelApiResponse>(`${this.apiUrl}/page-ativos`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getResponsaveisInativosPaginados(page: number = 1, perPage: number = 10): Observable<ResponsavelApiResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    return this.http.get<ResponsavelApiResponse>(`${this.apiUrl}/page-inativos`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getResponsavelDetalhes(id: number): Observable<SingleResponsavelApiResponse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<SingleResponsavelApiResponse>(url).pipe(
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