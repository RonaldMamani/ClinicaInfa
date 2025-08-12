import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { PacientesService } from '../../../controllers/pacientes/pacientes.service';
import { Paciente, PacientesPaginadosResponse } from '../../../core/models/paciente.model';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-listar-pacientes',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './listar-pacientes.component.html',
  styleUrls: ['./listar-pacientes.component.css']
})
export class ListarPacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  totalItems: number = 0;
  filtroAtivo: boolean | undefined = true;

  isLoading = true;
  error: string | null = null;
  successMessage: string | null = null;

  // Variáveis para o modal de exclusão
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

  carregarPacientes(): void {
    this.isLoading = true;
    this.error = null;
    this.pacientes = [];

    this.pacientesService.getPacientesPaginados(this.currentPage, this.filtroAtivo).subscribe({
      next: (response: PacientesPaginadosResponse) => {
        if (response.status && response.pacientes) {
          this.pacientes = response.pacientes.data;
          this.currentPage = response.pacientes.current_page;
          this.totalPages = response.pacientes.last_page;
          this.totalItems = response.pacientes.total;
          this.successMessage = response.message;
        } else {
          this.pacientes = [];
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
            this.carregarPacientes();
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

  onPageChange(newPage: number): void {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.carregarPacientes();
    }
  }

  aplicarFiltro(status: boolean | undefined): void {
    this.filtroAtivo = status;
    this.currentPage = 1;
    this.carregarPacientes();
  }
}