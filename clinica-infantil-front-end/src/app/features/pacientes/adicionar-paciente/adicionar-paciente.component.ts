import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

// Serviços
import { ClientesService } from '../../../controllers/clientes/clientes.service';
import { EstadosService } from '../../../controllers/estados/estados.service';
import { CidadesService } from '../../../controllers/cidades/cidades.service';
import { GenerosService } from '../../../controllers/generos/generos.service';
import { ResponsaveisService } from '../../../controllers/responsaveis/responsaveis.service';

// Modelos
import { Cidade, CreatePacientePayload } from '../../../core/models/cliente.model';
import { Estado } from '../../../core/models/estados.model';
import { Genero } from '../../../core/models/generos.model';
import { ResponsavelComCliente } from '../../../core/models/responsavel.model';

// Diretivas
import { InputMaskDirective } from '../../../shared/input-mask-directive';

@Component({
  selector: 'app-adicionar-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputMaskDirective, RouterLink],
  templateUrl: './adicionar-paciente.component.html',
  styleUrls: ['./adicionar-paciente.component.css']
})
export class AdicionarPacienteComponent implements OnInit {
  pacienteForm!: FormGroup;
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;
  
  estados: Estado[] = [];
  cidades: Cidade[] = [];
  generos: Genero[] = [];
  responsaveis: ResponsavelComCliente[] = [];

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private estadosService: EstadosService,
    private cidadesService: CidadesService,
    private generosService: GenerosService,
    private responsaveisService: ResponsaveisService,
    private router: Router
  ) { }

  get isAdministradorRoute(): boolean {
    return this.router.url.startsWith('/administrador');
  }

  ngOnInit(): void {
    this.pacienteForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      rg: [''],
      endereco: ['', Validators.required],
      id_estado: ['', Validators.required],
      id_cidade: ['', Validators.required],
      id_genero: ['', Validators.required],
      data_nascimento: ['', Validators.required],
      historico_medico: ['', Validators.required],
      id_responsavel: ['', Validators.required],
    });

    this.estadosService.getEstados().subscribe({
      next: (estados) => this.estados = estados,
      error: (err) => this.error = 'Não foi possível carregar os estados.'
    });

    this.generosService.getGeneros().subscribe({
        next: (response) => this.generos = response.generos,
        error: (err) => this.error = 'Não foi possível carregar os gêneros.'
    });

    this.responsaveisService.getResponsaveis().subscribe({
      next: (response) => {
        if (response && response.responsaveis) {
          this.responsaveis = response.responsaveis;
        } else {
          this.responsaveis = [];
        }
      },
      error: (err) => this.error = 'Não foi possível carregar a lista de responsáveis.'
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

    if (this.pacienteForm.valid) {
      this.isLoading = true;
      const formValue = this.pacienteForm.value;
      
      const payload: CreatePacientePayload = { 
        nome: formValue.nome,
        cpf: formValue.cpf,
        rg: formValue.rg,
        endereco: formValue.endereco,
        id_cidade: formValue.id_cidade,
        id_genero: formValue.id_genero,
        historico_medico: formValue.historico_medico,
        data_nascimento: formValue.data_nascimento,
        id_responsavel: formValue.id_responsavel,
      };

      this.clientesService.createCliente(payload).subscribe({
        next: (response) => {
          this.successMessage = 'Paciente adicionado com sucesso!';
          this.pacienteForm.reset();
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
    this.router.navigate(['/secretaria/clientes/adicionar']);
  }
}