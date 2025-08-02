import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

import { PacientesService } from '../../../controllers/pacientes/pacientes.service';
import { Paciente, PacientesApiResponse } from '../../../core/models/paciente.model';

@Component({
  selector: 'app-listar-pacientes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-pacientes.component.html',
  styleUrls: ['./listar-pacientes.component.css']
})
export class ListarPacientesComponent implements OnInit {
  pacientesAtivos: Paciente[] = [];
  pacientesInativos: Paciente[] = [];
  isLoading = true;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private pacientesService: PacientesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarPacientes();
  }

  carregarPacientes(): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      ativos: this.pacientesService.getActivePatients(),
      inativos: this.pacientesService.getInactivePatients()
    }).subscribe({
      next: (results) => {
        if (results.ativos && results.ativos.pacientes) {
          this.pacientesAtivos = results.ativos.pacientes;
        } else {
          this.pacientesAtivos = [];
        }

        if (results.inativos && results.inativos.pacientes) {
          this.pacientesInativos = results.inativos.pacientes;
        } else {
          this.pacientesInativos = [];
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar a lista de pacientes.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  editarPaciente(id: number): void {
    this.router.navigate(['/secretaria/pacientes/editar', id]);
  }

  // Lógica de exclusão/desativação completa
  excluirPaciente(id: number): void {
    this.error = null;
    this.successMessage = null;

    // Adiciona uma confirmação para evitar exclusões acidentais
    if (confirm('Tem certeza que deseja desativar este paciente?')) {
      this.pacientesService.deletePaciente(id).subscribe({
        next: (response) => {
          if (response.status) {
            this.successMessage = response.message;
            // Recarrega a lista para atualizar a visualização
            this.carregarPacientes();
          } else {
            this.error = response.message;
          }
        },
        error: (err) => {
          this.error = 'Erro ao tentar desativar o paciente.';
          console.error(err);
        }
      });
    }
  }
}