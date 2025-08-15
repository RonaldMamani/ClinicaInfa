import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Consulta } from '../../../core/models/consultas.model';
import { ConsultasService } from '../../../controllers/consultas/consultas.service';
import { HttpClientModule } from '@angular/common/http';
import { BotaoVoltarComponent } from "../../../components/botao-voltar/botao-voltar.component";

@Component({
  selector: 'app-detalhes-consulta',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, BotaoVoltarComponent],
  templateUrl: './detalhes-consulta.component.html',
  styleUrls: ['./detalhes-consulta.component.css']
})
export class DetalhesConsultaComponent implements OnInit {
  consulta: Consulta | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consultasService: ConsultasService
  ) {}

  get isSecretariaRoute(): boolean {
    return this.router.url.startsWith('/secretaria');
  }

  get isMedicoRoute(): boolean {
    return this.router.url.startsWith('/medico');
  }

  get isAdministradorRoute(): boolean {
    return this.router.url.startsWith('/administrador');
  }

  get isPagamentosRoute(): boolean {
    return this.router.url.startsWith('/administrador/pagamentos');
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.carregarDetalhesConsulta(id);
    } else {
      this.error = 'ID da consulta não fornecido.';
      this.isLoading = false;
    }
  }

  carregarDetalhesConsulta(id: number): void {
    this.consultasService.getConsultaById(id).subscribe({
      next: (response) => {
        this.consulta = response.consulta;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar os detalhes da consulta.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}