import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { Consulta } from '../../../core/models/consultas.model';
import { ConsultasService } from '../../../controllers/consultas/consultas.service';

@Component({
  selector: 'app-listar-todas-consultas',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './listar-todas-consultas.component.html',
  styleUrls: ['./listar-todas-consultas.component.css']
})
export class ListarTodasConsultasComponent implements OnInit {
  consultas: Consulta[] = [];
  isLoading = true;
  error: string | null = null;
  successMessage: string | null = null;

  showCancelModal = false;
  consultaToCancelId: number | null = null;

  constructor(
    private consultasService: ConsultasService,
    private router: Router) 
  {}

  ngOnInit(): void {
    this.carregarTodasConsultas();
  }

  get isSecretariaRoute(): boolean {
    return this.router.url.startsWith('/secretaria');
  }

  get isAdministradorRoute(): boolean {
    return this.router.url.startsWith('/administrador');
  }

  carregarTodasConsultas(): void {
    this.isLoading = true;
    this.error = null;

    this.consultasService.getTodasConsultas().subscribe({
      next: (response) => {
        this.consultas = response.consultas || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar as consultas.';
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
          this.carregarTodasConsultas(); // Recarrega a lista
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