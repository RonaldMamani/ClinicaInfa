import { Component } from '@angular/core';
import { ResponsaveisService } from '../../../controllers/responsaveis/responsaveis.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Responsavel } from '../../../core/models/responsavel.model';
import { forkJoin } from 'rxjs';

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
  successMessage: string | null = null;

  // Paginação para responsáveis ATIVOS
  currentPageAtivos = 1;
  lastPageAtivos = 1;
  totalResponsaveisAtivos = 0;
  pageSizeAtivos = 10; // Tamanho da página para ativos

  // Paginação para responsáveis INATIVOS
  currentPageInativos = 1;
  lastPageInativos = 1;
  totalResponsaveisInativos = 0;
  pageSizeInativos = 10; // Tamanho da página para inativos

  // Variáveis para o modal de confirmação
  showConfirmModal = false;
  selectedResponsavel: Responsavel | null = null;
  actionType: 'desativar' | 'reativar' | null = null;

  constructor(private responsavelService: ResponsaveisService) { }

  ngOnInit(): void {
    this.carregarResponsaveis();
  }

  carregarResponsaveis(): void {
    this.isLoading = true;
    this.error = null;
    this.successMessage = null;

    forkJoin({
      ativos: this.responsavelService.getResponsaveisAtivosPaginados(this.currentPageAtivos, this.pageSizeAtivos),
      inativos: this.responsavelService.getResponsaveisInativosPaginados(this.currentPageInativos, this.pageSizeInativos)
    }).subscribe({
      next: (results) => {
        // Processa responsáveis ativos
        this.responsaveisAtivos = results.ativos.responsaveis.data || [];
        this.currentPageAtivos = results.ativos.responsaveis.current_page;
        this.lastPageAtivos = results.ativos.responsaveis.last_page;
        this.totalResponsaveisAtivos = results.ativos.responsaveis.total;

        // Processa responsáveis inativos
        this.responsaveisInativos = results.inativos.responsaveis.data || [];
        this.currentPageInativos = results.inativos.responsaveis.current_page;
        this.lastPageInativos = results.inativos.responsaveis.last_page;
        this.totalResponsaveisInativos = results.inativos.responsaveis.total;

        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Falha ao carregar a lista de responsáveis.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // Métodos de paginação para responsáveis ATIVOS
  goToNextPageAtivos(): void {
    if (this.currentPageAtivos < this.lastPageAtivos) {
      this.currentPageAtivos++;
      this.carregarResponsaveis(); // Recarrega ambas as listas
    }
  }

  goToPreviousPageAtivos(): void {
    if (this.currentPageAtivos > 1) {
      this.currentPageAtivos--;
      this.carregarResponsaveis(); // Recarrega ambas as listas
    }
  }

  // Métodos de paginação para responsáveis INATIVOS
  goToNextPageInativos(): void {
    if (this.currentPageInativos < this.lastPageInativos) {
      this.currentPageInativos++;
      this.carregarResponsaveis(); // Recarrega ambas as listas
    }
  }

  goToPreviousPageInativos(): void {
    if (this.currentPageInativos > 1) {
      this.currentPageInativos--;
      this.carregarResponsaveis(); // Recarrega ambas as listas
    }
  }

  getNumeroPacientesAssociados(responsavel: Responsavel): number {
    return responsavel.pacientes ? responsavel.pacientes.length : 0;
  }

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
      const novoStatus = this.actionType === 'reativar';
      this.responsavelService.updateResponsavelStatus(this.selectedResponsavel.id, novoStatus).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.closeConfirmModal();
          this.carregarResponsaveis(); // Recarrega as listas para refletir a mudança
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          this.error = err.message || `Erro ao ${this.actionType} o responsável.`;
          console.error(err);
        }
      });
    }
  }
}
