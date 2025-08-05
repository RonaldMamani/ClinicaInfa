import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConsultasService } from '../../controllers/consultas/consultas.service';
import { ProntuariosService } from '../../controllers/prontuarios/prontuarios.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard-medico',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-medico.component.html',
  styleUrl: './dashboard-medico.component.css'
})
export class DashboardMedicoComponent {
  totalConsultas: number | null = null;
  proximasConsultas: number | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private consultasService: ConsultasService,
    private prontuarioService: ProntuariosService
  ) { }

  ngOnInit(): void {
    this.carregarContadores();
  }

  carregarContadores(): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      total: this.consultasService.getTotalConsultasCount(),
      agendadas: this.consultasService.getProximasConsultasCount()
    }).subscribe({
      next: (results) => {
        this.totalConsultas = results.total;
        this.proximasConsultas = results.agendadas;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar os dados do dashboard.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}
