import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CreateResponsavelPayload } from '../../../core/models/cliente.model';
import { Estado } from '../../../core/models/estados.model';
import { EstadosService } from '../../../controllers/estados/estados.service';
import { CidadesService } from '../../../controllers/cidades/cidades.service';
import { InputMaskDirective } from '../../../shared/input-mask-directive';
import { GenerosService } from '../../../controllers/generos/generos.service';
import { ClientesService } from '../../../controllers/clientes/clientes.service';
import { Cidade } from '../../../core/models/cidades.model';
import { Genero } from '../../../core/models/generos.model';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-adicionar-responsavel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputMaskDirective, HttpClientModule],
  templateUrl: './adicionar-responsavel.component.html',
  styleUrls: ['./adicionar-responsavel.component.css']
})
export class AdicionarResponsavelComponent implements OnInit {
  responsavelForm!: FormGroup;
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;
  
  estados: Estado[] = [];
  cidades: Cidade[] = [];
  generos: Genero[] = [];

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private estadosService: EstadosService,
    private cidadesService: CidadesService,
    private generosService: GenerosService,
    private router: Router
  ) { }

  get isAdministradorRoute(): boolean {
    return this.router.url.startsWith('/administrador');
  }

  ngOnInit(): void {
    this.responsavelForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      rg: [''],
      endereco: ['', Validators.required],
      id_estado: ['', Validators.required],
      id_cidade: ['', Validators.required],
      id_genero: ['', Validators.required],
      grau_parentesco: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
    });

    this.estadosService.getEstados().subscribe({
      next: (estados) => this.estados = estados,
      error: (err) => this.error = 'Não foi possível carregar os estados.'
    });

    this.generosService.getGeneros().subscribe({
        next: (response) => this.generos = response.generos,
        error: (err) => this.error = 'Não foi possível carregar os gêneros.'
    });
  }

  onEstadoSelecionado(idEstado: number): void {
    this.cidades = [];
    if (idEstado) {
      this.cidadesService.getCidadesPorEstado(idEstado).subscribe({
        next: (cidades) => this.cidades = cidades,
        error: (err) => this.error = 'Não foi possível carregar as cidades.'
      });
    }
  }

  onSubmit(): void {
    this.error = null;
    this.successMessage = null;

    if (this.responsavelForm.valid) {
      this.isLoading = true;
      const formValue = this.responsavelForm.value;
      
      const payload: CreateResponsavelPayload = {
        nome: formValue.nome,
        cpf: formValue.cpf,
        rg: formValue.rg,
        endereco: formValue.endereco,
        id_cidade: formValue.id_cidade,
        id_genero: formValue.id_genero,
        grau_parentesco: formValue.grau_parentesco,
        email: formValue.email,
        telefone: formValue.telefone,
      };

      this.clientesService.createCliente(payload).subscribe({
        next: (response) => {
          this.successMessage = 'Responsável adicionado com sucesso!';
          this.responsavelForm.reset();
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Erro na requisição.';
          this.isLoading = false;
        }
      });
    } else {
      this.error = 'Por favor, preencha todos os campos corretamente.';
    }
  }

  voltar(): void {
    this.router.navigate(['/secretaria/adicionar']);
  }

  voltarAdmin(): void {
    this.router.navigate(['/administrador/responsaveis']);
  }
}