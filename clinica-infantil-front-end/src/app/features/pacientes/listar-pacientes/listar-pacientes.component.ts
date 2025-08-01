import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacientesService } from '../pacientes.service';
import { Paciente } from '../../../core/models/paciente.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listar-pacientes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listar-pacientes.component.html',
  styleUrls: ['./listar-pacientes.component.css']
})
export class ListarPacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private pacientesService: PacientesService) { }

  ngOnInit(): void {
    this.getPacientesList();
  }

  getPacientesList(): void {
    this.isLoading = true;
    this.error = null;
    this.pacientesService.getPacientes().subscribe({
      next: (response) => {
        if (response.status && response.pacientes) {
          this.pacientes = response.pacientes;
          console.log('Pacientes carregados:', this.pacientes);
        } else {
          this.error = response.message || 'Erro ao carregar pacientes.';
          console.error('Erro na resposta da API:', response.message);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Não foi possível conectar ao servidor ou carregar os pacientes.';
        console.error('Erro na requisição HTTP:', err);
        this.isLoading = false;
      }
    });
  }
}