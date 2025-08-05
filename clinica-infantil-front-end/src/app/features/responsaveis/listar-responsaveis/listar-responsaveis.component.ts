import { Component } from '@angular/core';
import { FullResponsaveisApiResponse, ResponsaveisService, Responsavel } from '../../../controllers/responsaveis/responsaveis.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listar-responsaveis',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-responsaveis.component.html',
  styleUrl: './listar-responsaveis.component.css'
})
export class ListarResponsaveisComponent {
  responsaveisAtivos: Responsavel[] = [];
  responsaveisInativos: Responsavel[] = [];
  isLoading = true;
  error: string | null = null;
  successMessage: string | null = null; // Para mensagens de sucesso

  // Paginação para responsáveis ATIVOS
  currentPageAtivos = 1;
  lastPageAtivos = 1;
  totalResponsaveisAtivos = 0;

  // Paginação para responsáveis INATIVOS
  currentPageInativos = 1;
  lastPageInativos = 1;
  totalResponsaveisInativos = 0;

  // Variáveis para o modal de confirmação
  showConfirmModal = false;
  selectedResponsavel: Responsavel | null = null;
  actionType: 'desativar' | 'reativar' | null = null;

  constructor(private responsavelService: ResponsaveisService) { }

  ngOnInit(): void {
    this.carregarResponsaveis();
  }

  carregarResponsaveis(activePage: number = this.currentPageAtivos, inactivePage: number = this.currentPageInativos): void {
    this.isLoading = true;
    this.error = null;
    this.successMessage = null; // Limpa mensagens de sucesso ao recarregar

    this.responsavelService.getTodosResponsaveis(activePage, inactivePage).subscribe({
      next: (response: FullResponsaveisApiResponse) => {
        // Atribui os dados e informações de paginação para responsáveis ativos
        this.responsaveisAtivos = response.responsaveis_ativos.data || [];
        this.currentPageAtivos = response.responsaveis_ativos.current_page;
        this.lastPageAtivos = response.responsaveis_ativos.last_page;
        this.totalResponsaveisAtivos = response.responsaveis_ativos.total;

        // Atribui os dados e informações de paginação para responsáveis inativos
        this.responsaveisInativos = response.responsaveis_inativos.data || [];
        this.currentPageInativos = response.responsaveis_inativos.current_page;
        this.lastPageInativos = response.responsaveis_inativos.last_page;
        this.totalResponsaveisInativos = response.responsaveis_inativos.total;

        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Falha ao carregar a lista de responsáveis.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // Métodos de paginação (sem alterações)
  goToNextPageAtivos(): void {
    if (this.currentPageAtivos < this.lastPageAtivos) {
      this.currentPageAtivos++;
      this.carregarResponsaveis(this.currentPageAtivos, this.currentPageInativos);
    }
  }

  goToPreviousPageAtivos(): void {
    if (this.currentPageAtivos > 1) {
      this.currentPageAtivos--;
      this.carregarResponsaveis(this.currentPageAtivos, this.currentPageInativos);
    }
  }

  goToNextPageInativos(): void {
    if (this.currentPageInativos < this.lastPageInativos) {
      this.currentPageInativos++;
      this.carregarResponsaveis(this.currentPageAtivos, this.currentPageInativos);
    }
  }

  goToPreviousPageInativos(): void {
    if (this.currentPageInativos > 1) {
      this.currentPageInativos--;
      this.carregarResponsaveis(this.currentPageAtivos, this.currentPageInativos);
    }
  }

  getNumeroPacientesAssociados(responsavel: Responsavel): number {
    return responsavel.pacientes ? responsavel.pacientes.length : 0;
  }

  /**
   * Abre o modal de confirmação para desativar ou reativar um responsável.
   * @param responsavel O responsável selecionado.
   * @param action O tipo de ação ('desativar' ou 'reativar').
   */
  openConfirmModal(responsavel: Responsavel, action: 'desativar' | 'reativar'): void {
    this.selectedResponsavel = responsavel;
    this.actionType = action;
    this.showConfirmModal = true;
  }

  /**
   * Fecha o modal de confirmação.
   */
  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.selectedResponsavel = null;
    this.actionType = null;
    this.error = null; // Limpa erros do modal
  }

  /**
   * Executa a ação de desativar ou reativar o responsável após a confirmação.
   */
  confirmAction(): void {
    if (this.selectedResponsavel && this.actionType) {
      const novoStatus = this.actionType === 'reativar'; // true para reativar, false para desativar
      this.responsavelService.updateResponsavelStatus(this.selectedResponsavel.id, novoStatus).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.closeConfirmModal();
          this.carregarResponsaveis(); // Recarrega as listas para refletir a mudança
          setTimeout(() => this.successMessage = null, 3000); // Limpa a mensagem após 3 segundos
        },
        error: (err) => {
          this.error = err.message || `Erro ao ${this.actionType} o responsável.`;
          console.error(err);
          // Não fecha o modal para que o usuário veja o erro
        }
      });
    }
  }
}
