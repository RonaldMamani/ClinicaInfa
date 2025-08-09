import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagamento, PagamentosPaginateApiResponse } from '../../core/models/pagamento.model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagamentosService {

   private apiUrl = 'http://localhost:8000/api/pagamentos';

    constructor(private http: HttpClient) { }

    /**
     * Busca a lista de pagamentos com paginação.
     * @param page O número da página a ser buscada.
     * @returns Observable<PaginatedResponse>
     */
    getPagamentos(pageUrl: string | null = null): Observable<PagamentosPaginateApiResponse> {
        const url = pageUrl ? pageUrl : this.apiUrl;
        return this.http.get<PagamentosPaginateApiResponse>(url).pipe(
        catchError(error => {
            return throwError(() => new Error(error.error.message || 'Erro ao carregar pagamentos.'));
        })
        );
    }

    getPagamentoById(id: number): Observable<{ status: boolean; message: string; pagamento: Pagamento }> {
        return this.http.get<{ status: boolean; message: string; pagamento: Pagamento }>(`${this.apiUrl}/${id}`);
    }

    updatePagamento(id: number, data: { valor: number; metodo_pagamento: string }): Observable<{ status: boolean; message: string; pagamento: Pagamento }> {
        return this.http.put<{ status: boolean; message: string; pagamento: Pagamento }>(`${this.apiUrl}/${id}`, data);
    }
}
