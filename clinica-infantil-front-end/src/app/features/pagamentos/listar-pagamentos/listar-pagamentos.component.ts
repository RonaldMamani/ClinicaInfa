import { Component } from '@angular/core';
import { PagamentosService } from '../../../controllers/pagamentos/pagamentos.service';
import { Pagamento, PaginatedResponse } from '../../../core/models/pagamento.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listar-pagamentos',
  imports: [CommonModule, RouterLink],
  templateUrl: './listar-pagamentos.component.html',
  styleUrl: './listar-pagamentos.component.css'
})
export class ListarPagamentosComponent {
  pagamentos: Pagamento[] = [];
    paginator: PaginatedResponse | null = null;
    currentPage = 1;
    isLoading = true;
    errorMessage: string | null = null;

    constructor(private pagamentoService: PagamentosService) { }

    ngOnInit(): void {
        this.fetchPagamentos(this.currentPage);
    }

    /**
     * Busca os pagamentos da API para a página atual.
     * @param page O número da página a ser buscada.
     */
    fetchPagamentos(page: number): void {
        this.isLoading = true;
        this.errorMessage = null;
        this.pagamentoService.getPagamentos(page).subscribe({
            next: (response) => {
                this.pagamentos = response.pagamentos.data;
                this.paginator = response.pagamentos;
                this.currentPage = response.pagamentos.current_page;
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = 'Não foi possível carregar os pagamentos. Tente novamente mais tarde.';
                console.error('Erro ao buscar pagamentos:', err);
            }
        });
    }

    /**
     * Navega para a próxima página.
     */
    nextPage(): void {
        if (this.paginator && this.paginator.next_page_url) {
            this.fetchPagamentos(this.currentPage + 1);
        }
    }

    /**
     * Navega para a página anterior.
     */
    prevPage(): void {
        if (this.paginator && this.paginator.prev_page_url) {
            this.fetchPagamentos(this.currentPage - 1);
        }
    }
}
