import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { ConsultasService } from '../../../controllers/consultas/consultas.service';
import { Consulta, ConsultasPaginationApiResponse } from '../../../core/models/consultas.model';
import { HttpClientModule } from '@angular/common/http';
import { PaginatedApiResponse } from '../../../core/models/Paginate.model';

@Component({
  selector: 'app-listar-consultas-agendadas',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, HttpClientModule],
  templateUrl: './listar-consultas-agendadas.component.html',
  styleUrls: ['./listar-consultas-agendadas.component.css']
})
export class ListarConsultasAgendadasComponent implements OnInit {
  consultas: Consulta[] = [];
  pagination: PaginatedApiResponse<Consulta[]> | null = null;
  isLoading = true;
  error: string | null = null;
  successMessage: string | null = null;

  showCancelModal = false;
  consultaToCancelId: number | null = null;

  constructor(private consultasService: ConsultasService) {}

  ngOnInit(): void {
    this.carregarConsultasAgendadas();
  }

  carregarConsultasAgendadas(page: number = 1): void {
    this.isLoading = true;
    this.error = null;

    this.consultasService.getConsultasAgendadasListar(page).subscribe({
      next: (response: ConsultasPaginationApiResponse) => {
        // Acessa o array de consultas dentro do objeto de paginação
        this.consultas = response.consultas.data || [];
        this.pagination = response.consultas;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar as consultas agendadas.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onPageChange(url: string | null): void {
    if (url) {
      this.isLoading = true;
      const pageNumber = this.extractPageNumberFromUrl(url);
      if (pageNumber) {
        this.carregarConsultasAgendadas(pageNumber);
      }
    }
  }

  private extractPageNumberFromUrl(url: string): number | null {
    const params = new URLSearchParams(new URL(url).search);
    const page = params.get('page');
    return page ? parseInt(page, 10) : null;
  }

  openCancelModal(id: number): void {
    this.consultaToCancelId = id;
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.consultaToCancelId = null;
  }

  confirmCancel(): void {
    if (this.consultaToCancelId) {
      this.isLoading = true;
      this.consultasService.cancelarConsulta(this.consultaToCancelId).subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Consulta cancelada com sucesso!';
          this.closeCancelModal();
          this.carregarConsultasAgendadas(); // Recarrega a lista
        },
        error: (err) => {
          this.error = 'Erro ao cancelar a consulta.';
          this.isLoading = false;
          this.closeCancelModal();
          console.error(err);
        }
      });
    }
  }

  cancelarConsulta(id: number): void {
    this.openCancelModal(id);
  }
}