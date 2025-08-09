import { Component } from '@angular/core';
import { PagamentosService } from '../../../controllers/pagamentos/pagamentos.service';
import { Pagamento, PagamentosPaginateApiResponse } from '../../../core/models/pagamento.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PaginatedApiResponse } from '../../../core/models/Paginate.model';

@Component({
  selector: 'app-listar-pagamentos',
  imports: [CommonModule, RouterLink],
  templateUrl: './listar-pagamentos.component.html',
  styleUrl: './listar-pagamentos.component.css'
})
export class ListarPagamentosComponent {
  pagamentos: Pagamento[] = [];
  paginator: PaginatedApiResponse<Pagamento[]> | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private pagamentoService: PagamentosService) { }

  ngOnInit(): void {
    this.fetchPagamentos();
  }

  /**
   * Busca os pagamentos da API para a página atual.
   * @param pageUrl O URL da página a ser buscada.
   */
  fetchPagamentos(pageUrl: string | null = null): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.pagamentoService.getPagamentos(pageUrl).subscribe({
      next: (response) => {
        this.pagamentos = response.pagamentos.data;
        this.paginator = response.pagamentos;
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
   * Lida com a mudança de página da paginação.
   * @param pageUrl URL da página para a qual navegar.
   */
  onPageChange(pageUrl: string | null): void {
    if (pageUrl) {
      this.fetchPagamentos(pageUrl);
    }
  }
}
