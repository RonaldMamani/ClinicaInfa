import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { ConsultasService } from '../../../controllers/consultas/consultas.service';
import { Consulta, ConsultasAgendadasApiResponse } from '../../../core/models/consultas.model';

@Component({
  selector: 'app-listar-consultas-agendadas',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './listar-consultas-agendadas.component.html',
  styleUrls: ['./listar-consultas-agendadas.component.css']
})
export class ListarConsultasAgendadasComponent implements OnInit {
  consultas: Consulta[] = [];
  isLoading = true;
  error: string | null = null;
  successMessage: string | null = null;

  showCancelModal = false;
  consultaToCancelId: number | null = null;

  constructor(private consultasService: ConsultasService) {}

  ngOnInit(): void {
    this.carregarConsultasAgendadas();
  }

  carregarConsultasAgendadas(): void {
    this.isLoading = true;
    this.error = null;

    this.consultasService.getConsultasAgendadas().subscribe({
      next: (response: ConsultasAgendadasApiResponse) => {
        // CORRIGIDO: Acessando a propriedade 'consultas'
        this.consultas = response.consultas || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar as consultas agendadas.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  openCancelModal(id: number): void {
    this.consultaToCancelId = id;
    this.showCancelModal = true;
  }

  // Fecha o modal de confirmação
  closeCancelModal(): void {
    this.showCancelModal = false;
    this.consultaToCancelId = null;
  }

  // Método que executa o cancelamento após a confirmação no modal
  confirmCancel(): void {
    if (this.consultaToCancelId) {
      this.isLoading = true;
      this.consultasService.cancelarConsulta(this.consultaToCancelId).subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Consulta cancelada com sucesso!';
          this.closeCancelModal(); // Fecha o modal após o sucesso
          this.carregarConsultasAgendadas(); // Recarrega a lista
        },
        error: (err) => {
          this.error = 'Erro ao cancelar a consulta.';
          this.isLoading = false;
          this.closeCancelModal(); // Fecha o modal e exibe o erro
          console.error(err);
        }
      });
    }
  }

  // O método antigo, agora apenas abre o modal
  cancelarConsulta(id: number): void {
    this.openCancelModal(id);
  }
}