import { Component } from '@angular/core';
import { ConsultasService } from '../../../controllers/consultas/consultas.service';
import { AuthService } from '../../../controllers/auth/auth.service';
import { Consulta, ConsultasPaginationApiResponse } from '../../../core/models/consultas.model';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { PaginatedApiResponse } from '../../../core/models/Paginate.model';

@Component({
  selector: 'app-medico-consultas',
  imports: [CommonModule, RouterModule, RouterLink, HttpClientModule],
  templateUrl: './medico-consultas.component.html',
  styleUrl: './medico-consultas.component.css'
})
export class MedicoConsultasComponent {
  consultas: Consulta[] = [];
  pagination: PaginatedApiResponse<Consulta[]> | null = null;
  isLoading = true;
  error: string | null = null;
  successMessage: string | null = null;
  
  showCancelModal = false;
  consultaToCancelId: number | null = null;

  constructor(
    private consultasService: ConsultasService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarConsultasDoMedico();
  }

  carregarConsultasDoMedico(pageUrl: string | null = null): void {
    this.isLoading = true;
    this.error = null;
    this.successMessage = null;
    
    // O tipo de resposta esperado agora é ConsultasPaginationApiResponse
    this.consultasService.getConsultasDoMedico(pageUrl).subscribe({
      next: (response: ConsultasPaginationApiResponse) => {
        // Acessamos os dados da consulta de dentro do objeto de paginação
        this.consultas = response.consultas.data || [];
        // Armazenamos o objeto de paginação completo para uso no template
        this.pagination = response.consultas;
        this.isLoading = false;
        
        // --- ADIÇÃO PARA DEBUG ---
        console.log('Objeto de paginação recebido:', this.pagination);
        // ------------------------
      },
      error: (err) => {
        this.error = 'Falha ao carregar as consultas do médico.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onPageChange(pageUrl: string | null): void {
    if (pageUrl) {
      this.carregarConsultasDoMedico(pageUrl);
    }
  }
  
  // Métodos para o modal de cancelamento
  openCancelModal(consultaId: number): void {
    this.consultaToCancelId = consultaId;
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.consultaToCancelId = null;
  }
  
  confirmCancel(): void {
    if (this.consultaToCancelId) {
      this.consultasService.cancelarConsulta(this.consultaToCancelId).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.closeCancelModal();
          this.carregarConsultasDoMedico();
        },
        error: (err) => {
          this.error = 'Ocorreu um erro ao cancelar a consulta.';
          this.closeCancelModal();
          console.error(err);
        }
      });
    }
  }
}
