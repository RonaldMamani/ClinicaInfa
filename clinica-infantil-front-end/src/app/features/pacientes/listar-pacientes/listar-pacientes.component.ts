import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Paciente, PacientesApiResponse } from '../../../core/models/paciente.model';
import { Router, RouterModule } from '@angular/router';
import { ClientesService } from '../../clientes/clientes.service';

@Component({
  selector: 'app-listar-pacientes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-pacientes.component.html',
  styleUrls: ['./listar-pacientes.component.css']
})
export class ListarPacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private clientesService: ClientesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarPacientes();
  }

  carregarPacientes(): void {
    this.isLoading = true;
    this.error = null;
    this.clientesService.getPacientes().subscribe({
      next: (response: PacientesApiResponse) => {
        this.pacientes = response.pacientes;
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
    this.router.navigate(['/secretaria/clientes/editar-paciente', id]);
  }

  excluirPaciente(id: number): void {
    // Implemente a lógica de exclusão aqui, com uma confirmação
    console.log('Excluir paciente com ID:', id);
  }
}