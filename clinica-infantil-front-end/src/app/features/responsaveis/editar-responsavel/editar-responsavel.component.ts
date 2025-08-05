import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Cidade, Estado, Genero, ResponsaveisService } from '../../../controllers/responsaveis/responsaveis.service';
import { CidadesService } from '../../../controllers/cidades/cidades.service';
import { GenerosService } from '../../../controllers/generos/generos.service';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-editar-responsavel',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './editar-responsavel.component.html',
  styleUrl: './editar-responsavel.component.css'
})
export class EditarResponsavelComponent {
  responsavelForm: FormGroup;
  responsavelId: number | null = null;
  isLoading = true;
  isSubmitting = false;
  error: string | null = null;
  successMessage: string | null = null;

  cidades: Cidade[] = [];
  generos: Genero[] = [];
  estados: Estado[] = []; // Para armazenar estados únicos para o dropdown de estado (opcional)
  selectedEstadoNome: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private responsavelService: ResponsaveisService,
    private cidadeService: CidadesService,
    private generoService: GenerosService
  ) {
    this.responsavelForm = this.fb.group({
      grau_parentesco: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      cliente: this.fb.group({
        id: [null], // ID do cliente, necessário para validação unique no backend
        nome: ['', Validators.required],
        cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]], // Exemplo de regex para CPF
        rg: [''],
        endereco: ['', Validators.required],
        id_genero: ['', Validators.required],
        id_cidade: ['', Validators.required],
        ativo: [true, Validators.required] // Campo ativo
      })
    });
  }

  ngOnInit(): void {
    this.responsavelId = +this.route.snapshot.paramMap.get('id')!;
    if (this.responsavelId) {
      this.carregarDadosParaFormulario(this.responsavelId);
    } else {
      this.error = 'ID do responsável não fornecido na URL.';
      this.isLoading = false;
    }

    // Observa mudanças na cidade selecionada para atualizar o estado
    this.responsavelForm.get('cliente.id_cidade')?.valueChanges.subscribe(idCidade => {
      this.updateSelectedEstado(idCidade);
    });
  }

  carregarDadosParaFormulario(id: number): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      responsavelDetalhes: this.responsavelService.getResponsavelDetalhes(id),
      cidades: this.cidadeService.getCidades(),
      generos: this.generoService.getGeneros()
    }).subscribe({
      next: (results) => {
        const responsavel = results.responsavelDetalhes.responsavel;
        this.cidades = results.cidades;
        this.generos = results.generos;

        // Extrai estados únicos para um eventual dropdown de estado (opcional, se quiser filtrar cidades por estado)
        const uniqueStates = new Set<string>();
        this.cidades.forEach(c => {
          if (c.estado?.nome_estado) {
            uniqueStates.add(c.estado.nome_estado);
          }
        });
        this.estados = Array.from(uniqueStates).map(name => ({ nome_estado: name, id: 0, sigla: '' })); // Adapte para sua interface Estado real

        // Preenche o formulário com os dados do responsável e seu cliente
        this.responsavelForm.patchValue({
          grau_parentesco: responsavel.grau_parentesco,
          email: responsavel.email,
          telefone: responsavel.telefone,
          cliente: {
            id: responsavel.cliente?.id,
            nome: responsavel.cliente?.nome,
            cpf: responsavel.cliente?.cpf,
            rg: responsavel.cliente?.rg,
            endereco: responsavel.cliente?.endereco,
            id_genero: responsavel.cliente?.id_genero,
            id_cidade: responsavel.cliente?.cidade?.id, // Certifique-se de que é o ID da cidade
            ativo: responsavel.cliente?.ativo === 1 // Converte 0/1 para boolean
          }
        });
        this.updateSelectedEstado(responsavel.cliente?.cidade?.id); // Define o estado inicial

        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar os dados para edição.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  updateSelectedEstado(idCidade: number | null): void {
    const cidadeSelecionada = this.cidades.find(c => c.id === idCidade);
    this.selectedEstadoNome = cidadeSelecionada?.estado?.nome_estado || null;
  }

  onSubmit(): void {
    if (this.responsavelForm.valid && this.responsavelId) {
      this.isSubmitting = true;
      this.error = null;
      this.successMessage = null;

      const formValue = this.responsavelForm.value;
      
      // Converte o booleano 'ativo' de volta para 0 ou 1 para o backend
      formValue.cliente.ativo = formValue.cliente.ativo ? 1 : 0;

      this.responsavelService.updateResponsavel(this.responsavelId, formValue).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.isSubmitting = false;
          setTimeout(() => {
            this.router.navigate(['/administrador/responsaveis']);
          }, 2000);
        },
        error: (err) => {
          this.error = err.message || 'Erro ao atualizar responsável.';
          this.isSubmitting = false;
          console.error(err);
        }
      });
    } else {
      this.responsavelForm.markAllAsTouched();
      this.error = 'Por favor, preencha todos os campos obrigatórios corretamente.';
    }
  }
}
