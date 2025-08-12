import { Component } from '@angular/core';
import { Pagamento } from '../../../core/models/pagamento.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PagamentosService } from '../../../controllers/pagamentos/pagamentos.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-editar-pagamento',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HttpClientModule],
  templateUrl: './editar-pagamento.component.html',
  styleUrl: './editar-pagamento.component.css'
})
export class EditarPagamentoComponent {
  pagamento: Pagamento | null = null;
    pagamentoForm: FormGroup;
    isLoading = true;
    isUpdating = false;
    errorMessage: string | null = null;
    successMessage: string | null = null;
    pagamentoId: number | null = null;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private pagamentoService: PagamentosService
    ) {
        // Inicializa o formulário com valores padrão
        this.pagamentoForm = this.fb.group({
            valor: ['', [Validators.required, Validators.min(0)]],
            metodo_pagamento: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.pagamentoId = Number(this.route.snapshot.paramMap.get('id'));
        if (this.pagamentoId) {
            this.fetchPagamento(this.pagamentoId);
        } else {
            this.isLoading = false;
            this.errorMessage = 'ID do pagamento não encontrado na rota.';
        }
    }

    /**
     * Busca os detalhes de um pagamento específico da API.
     * @param id O ID do pagamento.
     */
    fetchPagamento(id: number): void {
        this.isLoading = true;
        this.pagamentoService.getPagamentoById(id).subscribe({
            next: (response) => {
                this.pagamento = response.pagamento;
                this.pagamentoForm.patchValue({
                    valor: this.pagamento.valor,
                    metodo_pagamento: this.pagamento.metodo_pagamento
                });
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = 'Erro ao carregar os detalhes do pagamento.';
                console.error('Erro ao buscar pagamento:', err);
            }
        });
    }

    /**
     * Envia o formulário de atualização para a API.
     */
    onSubmit(): void {
        if (this.pagamentoForm.valid && this.pagamentoId) {
            this.isUpdating = true;
            this.errorMessage = null;
            this.successMessage = null;
            this.pagamentoService.updatePagamento(this.pagamentoId, this.pagamentoForm.value).subscribe({
                next: (response) => {
                    this.isUpdating = false;
                    this.successMessage = response.message;
                    // Opcional: Atualiza os dados locais com a resposta da API
                    this.pagamento = response.pagamento;
                    // Navega de volta para a lista de pagamentos após 2 segundos
                    setTimeout(() => {
                        this.router.navigate(['/administrador/pagamentos']);
                    }, 2000);
                },
                error: (err) => {
                    this.isUpdating = false;
                    this.errorMessage = 'Erro ao atualizar pagamento. Verifique os dados.';
                    console.error('Erro ao atualizar pagamento:', err);
                }
            });
        }
    }
}
