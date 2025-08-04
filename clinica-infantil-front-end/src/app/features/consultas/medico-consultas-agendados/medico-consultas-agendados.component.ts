import { Component } from '@angular/core';
import { ConsultasService } from '../../../controllers/consultas/consultas.service';
import { AuthService } from '../../../controllers/auth/auth.service';
import { Consulta, ConsultasAgendadasApiResponse } from '../../../core/models/consultas.model';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-medico-consultas-agendados',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './medico-consultas-agendados.component.html',
  styleUrl: './medico-consultas-agendados.component.css'
})
export class MedicoConsultasAgendadosComponent {
  consultas: Consulta[] = [];
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
  
    carregarConsultasDoMedico(): void {
      this.isLoading = true;
      this.error = null;
      this.successMessage = null;
      
      this.consultasService.getConsultasDoMedicoAgendados().subscribe({
        next: (response: ConsultasAgendadasApiResponse) => {
          this.consultas = response.consultas || [];
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Falha ao carregar as consultas do médico.';
          this.isLoading = false;
          console.error(err);
        }
      });
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
    
    cancelarConsulta(): void {
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
