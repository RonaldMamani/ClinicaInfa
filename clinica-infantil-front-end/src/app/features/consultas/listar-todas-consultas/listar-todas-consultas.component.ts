import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { Consulta } from '../../../core/models/consultas.model';
import { ConsultasService } from '../../../controllers/consultas/consultas.service';

@Component({
  selector: 'app-listar-todas-consultas',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './listar-todas-consultas.component.html',
  styleUrls: ['./listar-todas-consultas.component.css']
})
export class ListarTodasConsultasComponent implements OnInit {
  consultas: Consulta[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private consultasService: ConsultasService) {}

  ngOnInit(): void {
    this.carregarTodasConsultas();
  }

  carregarTodasConsultas(): void {
    this.isLoading = true;
    this.error = null;

    this.consultasService.getTodasConsultas().subscribe({
      next: (response) => {
        this.consultas = response.consultas || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar as consultas.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}