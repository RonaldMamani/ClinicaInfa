import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

// Serviços
import { PacientesService } from '../../../controllers/pacientes/pacientes.service';
import { EstadosService } from '../../../controllers/estados/estados.service';
import { CidadesService } from '../../../controllers/cidades/cidades.service';
import { GenerosService } from '../../../controllers/generos/generos.service';

// Modelos
import { Estado } from '../../../core/models/estados.model';
import { Genero } from '../../../core/models/generos.model';
import { Paciente, UpdatePacientePayload } from '../../../core/models/paciente.model';

// Diretivas
import { InputMaskDirective } from '../../../shared/input-mask-directive';
import { ResponsaveisService } from '../../../controllers/responsaveis/responsaveis.service';
import { Cidade } from '../../../core/models/cidades.model';
import { Responsavel } from '../../../core/models/responsavel.model';

@Component({
  selector: 'app-editar-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputMaskDirective],
  templateUrl: './editar-paciente.component.html',
  styleUrls: ['./editar-paciente.component.css']
})
export class EditarPacienteComponent implements OnInit {
  pacienteForm!: FormGroup;
  pacienteId!: number;
  isLoading = true;
  isSaving = false;
  error: string | null = null;
  successMessage: string | null = null;
  
  estados: Estado[] = [];
  cidades: Cidade[] = [];
  generos: Genero[] = [];
  responsaveis: Responsavel[] = [];

  // Armazena o objeto paciente para ter acesso ao status 'ativo'
  private pacienteAtual: Paciente | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pacientesService: PacientesService,
    private estadosService: EstadosService,
    private cidadesService: CidadesService,
    private generosService: GenerosService,
    private responsaveisService: ResponsaveisService
  ) { }

  get isAdministradorRoute(): boolean {
    return this.router.url.startsWith('/administrador');
  }

  ngOnInit(): void {
    this.pacienteId = +this.route.snapshot.paramMap.get('id')!;
    
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
      // O controle de 'ativo' foi removido daqui
    });

    this.carregarDadosIniciais();
  }

  carregarDadosIniciais(): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      paciente: this.pacientesService.getPacienteById(this.pacienteId),
      estados: this.estadosService.getEstados(),
      generos: this.generosService.getGeneros(),
      responsaveis: this.responsaveisService.getResponsaveis()
    }).subscribe({
      next: (results) => {
        const pacienteData = results.paciente.paciente;
        this.pacienteAtual = pacienteData; // Armazena o paciente para uso posterior
        this.estados = results.estados;
        this.generos = results.generos.generos;
        this.responsaveis = results.responsaveis.responsaveis;
        
        this.cidadesService.getCidadesPorEstado(pacienteData.cliente.cidade.id_estado).subscribe(
          cidades => {
            this.cidades = cidades;
            
            this.pacienteForm.patchValue({
              nome: pacienteData.cliente.nome,
              cpf: pacienteData.cliente.cpf,
              rg: pacienteData.cliente.rg,
              endereco: pacienteData.cliente.endereco,
              id_estado: pacienteData.cliente.cidade.id_estado,
              id_cidade: pacienteData.cliente.cidade.id,
              id_genero: pacienteData.cliente.genero.id,
              data_nascimento: pacienteData.data_nascimento,
              historico_medico: pacienteData.historico_medico,
              id_responsavel: pacienteData.responsavel.id
            });
            this.isLoading = false;
          }
        );
      },
      error: (err) => {
        this.error = 'Falha ao carregar os dados do paciente.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onEstadoSelecionado(idEstado: number): void {
    this.cidades = [];
    this.pacienteForm.get('id_cidade')?.setValue(null);
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

    if (this.pacienteForm.valid && this.pacienteAtual) {
      this.isSaving = true;
      const formValue = this.pacienteForm.value;
      
      const payload: UpdatePacientePayload = { 
        nome: formValue.nome,
        cpf: formValue.cpf,
        rg: formValue.rg,
        endereco: formValue.endereco,
        id_cidade: formValue.id_cidade,
        id_genero: formValue.id_genero,
        historico_medico: formValue.historico_medico,
        data_nascimento: formValue.data_nascimento,
        id_responsavel: formValue.id_responsavel,
        ativo: this.pacienteAtual.cliente.ativo === 1
      };

      this.pacientesService.updatePaciente(this.pacienteId, payload).subscribe({
        next: (response) => {
          this.successMessage = 'Paciente atualizado com sucesso!';
          this.isSaving = false;
        },
        error: (err) => {
          this.error = 'Erro ao salvar as alterações.';
          this.isSaving = false;
          console.error(err);
        }
      });
    } else {
      this.error = 'Por favor, preencha todos os campos corretamente.';
    }
  }

  voltarSecretaria(): void {
    // Caminho corrigido
    this.router.navigate(['/secretaria/pacientes']);
  }

  voltarAdmin(): void {
    // Caminho corrigido
    this.router.navigate(['/administrador/pacientes']);
  }
}