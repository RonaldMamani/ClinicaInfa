import { Component } from '@angular/core';
import { ResponsaveisService } from '../../../controllers/responsaveis/responsaveis.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ResponsaveiPaginateResponse, Responsavel } from '../../../core/models/responsavel.model';
import { HttpClientModule } from '@angular/common/http';
import { BotaoVoltarComponent } from "../../../components/botao-voltar/botao-voltar.component";

@Component({
  selector: 'app-listar-responsaveis',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, BotaoVoltarComponent],
  templateUrl: './listar-responsaveis.component.html',
  styleUrl: './listar-responsaveis.component.css'
})
export class ListarResponsaveisComponent {
  // Lista unificada para a página atual
  responsaveis: Responsavel[] = [];
  
  // Variáveis de paginação e filtro unificadas
  currentPage = 1;
  totalPages = 0;
  totalItems = 0;
  pageSize = 15;
  filtroStatus: boolean | undefined = true;
  
  isLoading = true;
  error: string | null = null;
  successMessage: string | null = null;

  // Variáveis para o modal de confirmação (mantido)
  showConfirmModal = false;
  selectedResponsavel: Responsavel | null = null;
  actionType: 'desativar' | 'reativar' | null = null;

  constructor(private responsavelService: ResponsaveisService) { }

  ngOnInit(): void {
    this.carregarResponsaveis();
  }

  /**
   * Carrega a lista de responsáveis com base no filtro e na página atual.
   */
  carregarResponsaveis(): void {
    this.isLoading = true;
    this.error = null;
    this.responsaveis = [];

    // Chama o serviço com o filtro de status e a página atual
    this.responsavelService.getResponsaveisPaginados(this.currentPage, this.filtroStatus).subscribe({
      next: (response: ResponsaveiPaginateResponse) => {
        if (response.status && response.responsaveis) {
          this.responsaveis = response.responsaveis.data || [];
          this.currentPage = response.responsaveis.current_page;
          this.totalPages = response.responsaveis.last_page;
          this.totalItems = response.responsaveis.total;
          this.pageSize = response.responsaveis.per_page;
        } else {
          this.responsaveis = [];
          this.error = response.message || 'Nenhum responsável encontrado.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Falha ao carregar a lista de responsáveis.';
        this.isLoading = false;
        console.error('Erro ao buscar responsáveis paginados:', err);
      }
    });
  }

  /**
   * Navega para uma página específica.
   * @param newPage O número da nova página.
   */
  onPageChange(newPage: number): void {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.carregarResponsaveis();
    }
  }

  /**
   * Aplica um novo filtro e recarrega a lista.
   * @param status O status a ser filtrado: true (ativos), false (inativos), undefined (todos).
   */
  aplicarFiltro(status: boolean | undefined): void {
    this.filtroStatus = status;
    this.currentPage = 1; // Reseta para a primeira página
    this.carregarResponsaveis();
  }

  getNumeroPacientesAssociados(responsavel: Responsavel): number {
    return responsavel.pacientes ? responsavel.pacientes.length : 0;
  }

  // Métodos do Modal (mantidos)
  openConfirmModal(responsavel: Responsavel, action: 'desativar' | 'reativar'): void {
    this.selectedResponsavel = responsavel;
    this.actionType = action;
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.selectedResponsavel = null;
    this.actionType = null;
    this.error = null;
  }

  confirmAction(): void {
    if (this.selectedResponsavel && this.actionType) {
      this.isLoading = true;
      const novoStatus = this.actionType === 'reativar';
      this.responsavelService.updateResponsavelStatus(this.selectedResponsavel.id, novoStatus).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.closeConfirmModal();
          this.carregarResponsaveis();
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          this.error = err.message || `Erro ao ${this.actionType} o responsável.`;
          console.error(err);
          this.isLoading = false;
        }
      });
    }
  }
}
