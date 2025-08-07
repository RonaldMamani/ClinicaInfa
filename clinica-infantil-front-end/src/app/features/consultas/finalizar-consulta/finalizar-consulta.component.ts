import { Component } from '@angular/core';
import { Consulta, ConsultaDetailsResponse, FinalizarConsultaPayload } from '../../../core/models/consultas.model';
import { finalize } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConsultasService } from '../../../controllers/consultas/consultas.service';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-finalizar-consulta',
  imports: [CommonModule, RouterModule, RouterLink, ReactiveFormsModule],
  templateUrl: './finalizar-consulta.component.html',
  styleUrl: './finalizar-consulta.component.css'
})
export class FinalizarConsultaComponent {
  consultaId: number | null = null;
  consulta!: Consulta;
  finalizarForm!: FormGroup;

  isLoading = true;
  isSubmitting = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private consultasService: ConsultasService
  ) { }

  ngOnInit(): void {
    // Inicializa o formulário de finalização
    this.finalizarForm = this.fb.group({
      valor: ['', [Validators.required, Validators.min(0.01)]],
      metodo_pagamento: ['', Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.consultaId = +id; // Converte a string do ID para número
        this.carregarDetalhesConsulta(this.consultaId);
      } else {
        this.error = 'ID da consulta não fornecido.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Carrega os detalhes da consulta para exibir na tela.
   * @param id O ID da consulta.
   */
  carregarDetalhesConsulta(id: number): void {
    this.isLoading = true;
    this.error = null;
    this.consultasService.getConsultaById(id).subscribe({
      next: (response: ConsultaDetailsResponse) => {
        this.consulta = response.consulta;
        this.isLoading = false;
        // Valida se a consulta pode ser finalizada
        if (this.consulta.status !== 'concluida') {
          this.error = 'Esta consulta não pode ser finalizada. O status deve ser "concluida".';
          // Desabilita o formulário
          this.finalizarForm.disable();
        }
      },
      error: (err) => {
        this.error = 'Falha ao carregar os detalhes da consulta.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  /**
   * Envia o formulário para finalizar a consulta.
   */
  onSubmit(): void {
    this.error = null;
    this.successMessage = null;

    if (this.finalizarForm.invalid || !this.consultaId) {
      this.finalizarForm.markAllAsTouched();
      this.error = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    this.isSubmitting = true;

    // Constrói o payload com a data de pagamento atual
    const payload: FinalizarConsultaPayload = {
      ...this.finalizarForm.value,
      data_pagamento: new Date().toISOString() // Formato ISO 8601
    };

    this.consultasService.finalizarConsulta(this.consultaId, payload)
      .pipe(
        finalize(() => this.isSubmitting = false)
      )
      .subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Consulta finalizada com sucesso!';
          // Redireciona para a lista de consultas após um pequeno atraso
          setTimeout(() => {
            this.router.navigate(['/secretaria/consultas/agendadas']);
          }, 2000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Erro ao finalizar a consulta.';
          console.error(err);
        }
      });
  }

  /**
   * Retorna para a lista de consultas agendadas.
   */
  voltar(): void {
    this.router.navigate(['/secretaria/consultas/agendadas']);
  }
}
