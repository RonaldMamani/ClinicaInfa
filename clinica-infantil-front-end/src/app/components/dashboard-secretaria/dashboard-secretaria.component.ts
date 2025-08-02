import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsultasService } from '../../controllers/consultas/consultas.service';
import { catchError, forkJoin, of } from 'rxjs';
import { PacientesService } from '../../controllers/pacientes/pacientes.service';

@Component({
  selector: 'app-dashboard-secretaria',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-secretaria.component.html',
  styleUrl: './dashboard-secretaria.component.css'
})
export class DashboardSecretariaComponent implements OnInit {
  isLoading = true;
  error: string | null = null;
  
  // Propriedades para armazenar as quantidades
  quantidadeTotal: number | null = null;
  quantidadeAgendadas: number | null = null;
  
  // Novas propriedades para a contagem de pacientes
  pacientesCadastrados: number | null = null;
  pacientesAtivos: number | null = null;
  pacientesInativos: number | null = null;

  constructor(
    private consultasService: ConsultasService,
    private pacientesService: PacientesService
  ) {}

  ngOnInit(): void {
    this.carregarDadosDashboard();
  }

  carregarDadosDashboard(): void {
    this.isLoading = true;
    this.error = null;

    // Requisição para buscar a quantidade total de consultas
    const todasConsultas$ = this.consultasService.getQuantidadeTodasConsultas().pipe(
      catchError(err => {
        console.error('Erro ao buscar quantidade total de consultas:', err);
        return of(null);
      })
    );

    // Requisição para buscar a quantidade de consultas agendadas
    const agendadas$ = this.consultasService.getQuantidadeAgendadas().pipe(
      catchError(err => {
        console.error('Erro ao buscar quantidade de consultas agendadas:', err);
        return of(null);
      })
    );
    
    // Nova chamada de API para contagem de pacientes
    const pacientes$ = this.pacientesService.getContagemPacientes().pipe(
        catchError(err => {
            console.error('Erro ao buscar contagem de pacientes:', err);
            return of(null);
        })
    );

    // Combina as três requisições para rodarem em paralelo
    forkJoin({
      totalConsultas: todasConsultas$,
      agendadas: agendadas$,
      pacientes: pacientes$
    }).subscribe({
      next: (results) => {
        if (results.totalConsultas) {
          this.quantidadeTotal = results.totalConsultas.quantidade_total;
        }
        if (results.agendadas) {
          this.quantidadeAgendadas = results.agendadas.quantidade_agendadas;
        }
        if (results.pacientes) {
          this.pacientesAtivos = results.pacientes.dados.ativos;
          this.pacientesInativos = results.pacientes.dados.inativos;
          this.pacientesCadastrados = this.pacientesAtivos + this.pacientesInativos;
        }

        if (!results.totalConsultas || !results.agendadas || !results.pacientes) {
          this.error = 'Ocorreu um erro ao carregar um ou mais dados do dashboard.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Ocorreu um erro ao carregar os dados do dashboard.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}
