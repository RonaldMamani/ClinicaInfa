import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { PacientesService } from '../../../controllers/pacientes/pacientes.service';
import { Paciente, PacientesPaginadosResponse } from '../../../core/models/paciente.model';
import { HttpClientModule } from '@angular/common/http';
import { PaginatedApiResponse } from '../../../core/models/Paginate.model';
import { BotaoVoltarComponent } from "../../../components/botao-voltar/botao-voltar.component";

@Component({
  selector: 'app-listar-pacientes',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, BotaoVoltarComponent],
  templateUrl: './listar-pacientes.component.html',
  styleUrls: ['./listar-pacientes.component.css']
})
export class ListarPacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  pagination: PaginatedApiResponse<Paciente[]> | null = null;
  filtroAtivo: boolean | undefined = true;

  isLoading = true;
  error: string | null = null;
  successMessage: string | null = null;

  showModal = false;
  pacienteParaExcluirId: number | null = null;

  constructor(
    private pacientesService: PacientesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarPacientes();
  }

  get isAdministradorRoute(): boolean {
    return this.router.url.startsWith('/administrador');
  }

  // Refatorado para aceitar um URL completo ou um número de página
  carregarPacientes(pageUrl: string | null = null): void {
    this.isLoading = true;
    this.error = null;
    this.successMessage = null;
    this.pacientes = [];
    let pageNumber = 1;
    if (pageUrl) {
      const url = new URL(pageUrl);
      const pageParam = url.searchParams.get('page');
      if (pageParam) {
        pageNumber = parseInt(pageParam, 10);
      }
    } else if (this.pagination) {
        pageNumber = this.pagination.current_page;
    }

    // Chamamos o serviço com o número da página e o filtro
    this.pacientesService.getPacientesPaginados(pageNumber, this.filtroAtivo).subscribe({
      next: (response: PacientesPaginadosResponse) => {
        if (response.status && response.pacientes) {
          this.pacientes = response.pacientes.data;
          this.pagination = response.pacientes;
          this.successMessage = response.message;
        } else {
          this.pacientes = [];
          this.pagination = null;
          this.error = response.message || 'Nenhum paciente encontrado.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar a lista de pacientes. Tente novamente mais tarde.';
        this.isLoading = false;
        console.error('Erro ao buscar pacientes paginados:', err);
      }
    });
  }

  abrirModalExclusao(id: number): void {
    this.pacienteParaExcluirId = id;
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
    this.pacienteParaExcluirId = null;
  }

  confirmarExclusao(): void {
    this.error = null;
    this.successMessage = null;

    if (this.pacienteParaExcluirId !== null) {
      this.pacientesService.deletePaciente(this.pacienteParaExcluirId).subscribe({
        next: (response) => {
          if (response.status) {
            this.successMessage = response.message;
            this.carregarPacientes(this.pagination?.current_page.toString());
          } else {
            this.error = response.message;
          }
          this.fecharModal();
        },
        error: (err) => {
          this.error = 'Erro ao tentar desativar o paciente.';
          console.error(err);
          this.fecharModal();
        }
      });
    }
  }

  editarPaciente(id: number): void {
    const routePrefix = this.isAdministradorRoute ? '/administrador' : '/secretaria';
    this.router.navigate([`${routePrefix}/pacientes/editar`, id]);
  }

  // Agora aceita um URL para a página
  onPageChange(pageUrl: string | null): void {
    if (pageUrl) {
      this.carregarPacientes(pageUrl);
    }
  }

  aplicarFiltro(status: boolean | undefined): void {
    this.filtroAtivo = status;
    this.carregarPacientes();
  }
}