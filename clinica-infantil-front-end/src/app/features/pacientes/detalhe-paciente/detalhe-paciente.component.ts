import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PacientesService } from '../pacientes.service';
import { ClientesService } from '../../clientes/clientes.service'; // Importe o serviço de clientes
import { Paciente } from '../../../core/models/paciente.model';
import { forkJoin, of } from 'rxjs'; // Importe forkJoin e of
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-detalhes-paciente',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalhe-paciente.component.html',
  styleUrls: ['./detalhe-paciente.component.css']
})
export class DetalhePacienteComponent implements OnInit {
  paciente: Paciente | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  pacienteId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacientesService: PacientesService,
    private clientesService: ClientesService // Injetar o serviço de clientes
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.pacienteId = Number(params.get('id'));
      if (this.pacienteId) {
        this.getPacienteDetails(this.pacienteId);
      } else {
        this.error = 'ID do paciente não fornecido na URL.';
        this.isLoading = false;
      }
    });
  }

  getPacienteDetails(id: number): void {
    this.isLoading = true;
    this.error = null;

    // 1. Obtenha os detalhes do paciente principal
    this.pacientesService.getPacienteById(id).subscribe({
      next: (response) => {
        if (response.status && response.paciente) {
          this.paciente = response.paciente;

          // 2. Se o paciente tem um responsável, busque os detalhes do cliente do responsável
          if (this.paciente.responsavel && this.paciente.responsavel.id_cliente) {
            this.clientesService.getClienteById(this.paciente.responsavel.id_cliente).subscribe({
              next: (clienteResponse) => {
                if (clienteResponse.status && clienteResponse.cliente) {
                  // Anexa o objeto cliente completo ao objeto responsavel
                  this.paciente!.responsavel.cliente = clienteResponse.cliente;
                }
                this.isLoading = false;
              },
              error: (err) => {
                console.error('Erro ao buscar cliente do responsável:', err);
                this.isLoading = false;
                // Exibe o paciente mesmo com erro no cliente do responsável
              }
            });
          } else {
            // Se não houver responsável ou id_cliente, encerra o carregamento
            this.isLoading = false;
          }
        } else {
          this.error = response.message || 'Paciente não encontrado ou erro na API.';
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.error = 'Não foi possível carregar os detalhes do paciente.';
        console.error('Erro na requisição HTTP:', err);
        this.isLoading = false;
      }
    });
  }

  editarPaciente(): void {
    if (this.pacienteId) {
      this.router.navigate(['/secretaria/pacientes/editar', this.pacienteId]);
    }
  }
}