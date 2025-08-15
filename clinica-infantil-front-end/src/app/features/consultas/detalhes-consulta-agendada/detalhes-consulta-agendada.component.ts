import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConsultasService } from '../../../controllers/consultas/consultas.service';
import { Consulta, ConsultaDetailsResponse } from '../../../core/models/consultas.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BotaoVoltarComponent } from "../../../components/botao-voltar/botao-voltar.component";

@Component({
  selector: 'app-detalhes-consulta-agendada',
  imports: [CommonModule, RouterLink, HttpClientModule, BotaoVoltarComponent],
  templateUrl: './detalhes-consulta-agendada.component.html',
  styleUrl: './detalhes-consulta-agendada.component.css'
})
export class DetalhesConsultaAgendadaComponent {
  consulta: Consulta | null = null;
    isLoading = true;
    error: string | null = null;

    constructor(
      private route: ActivatedRoute,
      private consultasService: ConsultasService
    ) {}

    ngOnInit(): void {
      this.carregarDetalhesDaConsulta();
    }

    carregarDetalhesDaConsulta(): void {
    this.isLoading = true;
    this.error = null;

    // Obtém o 'id' dos parâmetros da URL e converte para número
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // Chama o novo método do serviço para buscar a consulta agendada por ID
      this.consultasService.getConsultaAgendadaById(+id).subscribe({
        next: (response: ConsultaDetailsResponse) => {
          // Atribui o objeto de consulta à variável do componente
          this.consulta = response.consulta || null;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Falha ao carregar os detalhes da consulta.';
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      // Se não houver ID na URL, define a mensagem de erro
      this.error = 'ID da consulta não fornecido na URL.';
      this.isLoading = false;
    }
  }
}
