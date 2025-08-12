import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

// Serviços
import { ResponsaveisService } from '../../../controllers/responsaveis/responsaveis.service';

// Modelos
import { Responsavel } from '../../../core/models/responsavel.model';
import { Estado } from '../../../core/models/estados.model';
import { Cidade } from '../../../core/models/cidades.model';
import { Genero, GeneroApiResponse } from '../../../core/models/generos.model';
import { ResponsavelDetailsResponse } from '../../../core/models/responsavel.model';
import { CidadesService } from '../../../controllers/cidades/cidades.service';
import { GenerosService } from '../../../controllers/generos/generos.service';
import { EstadosService } from '../../../controllers/estados/estados.service';

import { InputMaskDirective } from '../../../shared/input-mask-directive';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-editar-responsavel',
  standalone: true,
  imports: [ CommonModule, RouterModule, ReactiveFormsModule, InputMaskDirective, HttpClientModule ],
  templateUrl: './editar-responsavel.component.html',
  styleUrls: ['./editar-responsavel.component.css']
})
export class EditarResponsavelComponent implements OnInit {
  responsavelForm!: FormGroup;
  responsavelId!: number;
  isLoading = true;
  isSaving = false;
  error: string | null = null;
  successMessage: string | null = null;

  estados: Estado[] = [];
  cidades: Cidade[] = [];
  generos: Genero[] = [];
  selectedEstadoNome: string | null = null;

  private responsavelAtual: Responsavel | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private responsavelService: ResponsaveisService,
    private cidadeService: CidadesService,
    private generoService: GenerosService,
    private estadosService: EstadosService
  ) {
    this.responsavelForm = this.fb.group({
      grau_parentesco: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      cliente: this.fb.group({
        id: [null],
        nome: ['', Validators.required],
        cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
        rg: [''],
        endereco: ['', Validators.required],
        id_estado: ['', Validators.required],
        id_cidade: ['', Validators.required],
        id_genero: ['', Validators.required],
        ativo: [true, Validators.required]
      })
    });
  }

  ngOnInit(): void {
    this.responsavelId = +this.route.snapshot.paramMap.get('id')!;
    if (this.responsavelId) {
      this.carregarDadosIniciais();
    } else {
      this.error = 'ID do responsável não fornecido na URL.';
      this.isLoading = false;
    }

    this.responsavelForm.get('cliente.id_estado')?.valueChanges.subscribe(idEstado => {
      this.onEstadoSelecionado(idEstado);
    });

    this.responsavelForm.get('cliente.id_cidade')?.valueChanges.subscribe(idCidade => {
      this.updateSelectedEstado(idCidade);
    });
  }

  carregarDadosIniciais(): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      responsavelDetalhes: this.responsavelService.getResponsavelDetalhes(this.responsavelId),
      estados: this.estadosService.getEstados(),
      generos: this.generoService.getGeneros(),
    }).subscribe({
      next: (results: {
        responsavelDetalhes: ResponsavelDetailsResponse,
        estados: Estado[],
        generos: GeneroApiResponse,
      }) => {
        const responsavel = results.responsavelDetalhes.responsavel;
        this.responsavelAtual = responsavel;
        this.estados = results.estados;
        this.generos = results.generos.generos;

        this.responsavelForm.patchValue({
          grau_parentesco: responsavel.grau_parentesco,
          email: responsavel.email,
          telefone: responsavel.telefone,
          cliente: {
            id: responsavel.cliente.id,
            nome: responsavel.cliente.nome,
            cpf: responsavel.cliente.cpf,
            rg: responsavel.cliente.rg,
            endereco: responsavel.cliente.endereco,
            id_estado: responsavel.cliente.cidade?.id_estado,
            id_cidade: responsavel.cliente.cidade?.id,
            id_genero: responsavel.cliente.genero?.id,
            ativo: responsavel.cliente.ativo === 1
          }
        });

        if (responsavel.cliente.cidade?.id_estado) {
          this.cidadeService.getCidadesPorEstado(responsavel.cliente.cidade.id_estado).subscribe({
            next: (cidades: Cidade[]) => {
              this.cidades = cidades;
              this.updateSelectedEstado(responsavel.cliente.cidade?.id);
              this.isLoading = false;
            },
            error: (err) => {
              this.error = 'Não foi possível carregar as cidades para o estado do responsável.';
              this.isLoading = false;
              console.error(err);
            }
          });
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.error = err.message || 'Falha ao carregar os dados para edição.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onEstadoSelecionado(idEstado: number): void {
    this.cidades = [];
    this.responsavelForm.get('cliente.id_cidade')?.setValue(null);

    if (idEstado) {
      this.cidadeService.getCidadesPorEstado(idEstado).subscribe({
        next: (cidades: Cidade[]) => {
          this.cidades = cidades;
        },
        error: (err) => {
          this.error = 'Não foi possível carregar as cidades para o estado selecionado.';
          console.error(err);
        }
      });
    }
  }

  updateSelectedEstado(idCidade: number | null): void {
    const cidadeSelecionada = this.cidades.find(c => c.id === idCidade);
    this.selectedEstadoNome = cidadeSelecionada?.estado?.nome_estado || null;
  }

  onSubmit(): void {
    this.error = null;
    this.successMessage = null;

    if (this.responsavelForm.valid && this.responsavelId) {
      this.isSaving = true;
      const formValue = this.responsavelForm.value;

      formValue.cliente.ativo = formValue.cliente.ativo ? 1 : 0;

      this.responsavelService.updateResponsavel(this.responsavelId, formValue).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.isSaving = false;
          setTimeout(() => {
            this.router.navigate(['/administrador/responsaveis']);
          }, 2000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Erro ao atualizar responsável.';
          if (err.error?.errors) {
            for (const key in err.error.errors) {
              if (err.error.errors.hasOwnProperty(key)) {
                this.error += `\n${err.error.errors[key].join(', ')}`;
              }
            }
          }
          this.isSaving = false;
          console.error(err);
        }
      });
    } else {
      this.responsavelForm.markAllAsTouched();
      this.error = 'Por favor, preencha todos os campos obrigatórios corretamente.';
    }
  }

  voltarAdmin(): void {
    this.router.navigate(['/administrador/responsaveis']);
  }
}