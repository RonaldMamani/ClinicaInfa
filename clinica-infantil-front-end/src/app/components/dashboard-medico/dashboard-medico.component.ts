import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProntuariosService } from '../../controllers/prontuarios/prontuarios.service';
import { forkJoin } from 'rxjs';
import { MedicosService } from '../../controllers/medicos/medicos.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard-medico',
  imports: [CommonModule, RouterLink, HttpClientModule],
  templateUrl: './dashboard-medico.component.html',
  styleUrl: './dashboard-medico.component.css'
})
export class DashboardMedicoComponent implements OnInit {
  totalConsultas: number | null = null;
  proximasConsultas: number | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private medicosService: MedicosService,
    private prontuarioService: ProntuariosService
  ) { }

  ngOnInit(): void {
    this.carregarContadores();
  }

  carregarContadores(): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      total: this.medicosService.getTotalConsultasCount(),
      agendadas: this.medicosService.getProximasConsultasCount()
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
