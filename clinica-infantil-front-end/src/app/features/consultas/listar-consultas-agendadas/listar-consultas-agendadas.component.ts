import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConsultasService } from '../../../controllers/consultas/consultas.service';
import { Consulta, ConsultasAgendadasApiResponse } from '../../../core/models/consultas.model';

@Component({
  selector: 'app-listar-consultas-agendadas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-consultas-agendadas.component.html',
  styleUrls: ['./listar-consultas-agendadas.component.css']
})
export class ListarConsultasAgendadasComponent implements OnInit {
  consultas: Consulta[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private consultasService: ConsultasService) {}

  ngOnInit(): void {
    this.carregarConsultasAgendadas();
  }

  carregarConsultasAgendadas(): void {
    this.isLoading = true;
    this.error = null;

    this.consultasService.getConsultasAgendadas().subscribe({
      next: (response: ConsultasAgendadasApiResponse) => {
        // CORRIGIDO: Acessando a propriedade 'consultas'
        this.consultas = response.consultas || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar as consultas agendadas.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}