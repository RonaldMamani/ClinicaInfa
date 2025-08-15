import { Component } from '@angular/core';
import { UpdateUsuarioPayload, Usuario, UsuarioDetailsResponse } from '../../../core/models/usuario.model';
import { Perfil } from '../../../core/models/perfil.model';
import { Funcionario } from '../../../core/models/funcionario.model';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuariosService } from '../../../controllers/usuarios/usuarios.service';
import { CommonModule } from '@angular/common';
import { InputMaskDirective } from '../../../shared/input-mask-directive';
import { PerfisService } from '../../../controllers/perfis/perfis.service';
import { FuncionariosService } from '../../../controllers/funcionarios/funcionarios.service';
import { HttpClientModule } from '@angular/common/http';
import { BotaoVoltarComponent } from "../../../components/botao-voltar/botao-voltar.component";

@Component({
  selector: 'app-editar-funcionario',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, InputMaskDirective, HttpClientModule, BotaoVoltarComponent],
  templateUrl: './editar-funcionario.component.html',
  styleUrl: './editar-funcionario.component.css'
})
export class EditarFuncionarioComponent {
  usuarioForm!: FormGroup;
  usuarioId!: number;
  isLoading = true;
  isSaving = false;
  error: string | null = null;
  successMessage: string | null = null;

  perfis: Perfil[] = [];
  funcionarios: Funcionario[] = [];
  isMedicoProfileSelected: boolean = false; // Para controlar a exibição dos campos de médico

  private usuarioAtual: Usuario | null = null; // Armazena o usuário original

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuariosService,
    private perfilService: PerfisService,
    private funcionarioService: FuncionariosService
  ) { }

  ngOnInit(): void {
    this.usuarioId = +this.route.snapshot.paramMap.get('id')!; // Obtém o ID da URL

    this.usuarioForm = this.fb.group({
      username: ['', Validators.required],
      id_perfil: ['', Validators.required],
      id_funcionario: ['', Validators.required],
      ativo: [true, Validators.required],
      
      // Grupo para dados do funcionário (não é um FormBuilder.group completo, pois os campos são diretos do Funcionario)
      // Estes campos serão preenchidos via patchValue e enviados no payload 'funcionario'
      funcionario: this.fb.group({
        nome: ['', Validators.required],
        cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
        cargo: ['', Validators.required],
        email_empresarial: ['', [Validators.required, Validators.email]],
        telefone_empresarial: ['', Validators.required]
      }),

      // Grupo para dados do médico (condicional)
      medico: this.fb.group({
        CRM: [''],
        especialidade: ['']
      })
    });

    this.carregarDadosIniciais();

    // Observa mudanças no perfil selecionado para exibir/ocultar campos de médico
    this.usuarioForm.get('id_perfil')?.valueChanges.subscribe(perfilId => {
      const perfilSelecionado = this.perfis.find(p => p.id === perfilId);
      this.isMedicoProfileSelected = perfilSelecionado?.nome_perfil === 'Medico';

      // Se o perfil não for médico, limpa e desabilita os campos de médico
      if (!this.isMedicoProfileSelected) {
        this.usuarioForm.get('medico.CRM')?.clearValidators();
        this.usuarioForm.get('medico.especialidade')?.clearValidators();
        this.usuarioForm.get('medico.CRM')?.setValue('');
        this.usuarioForm.get('medico.especialidade')?.setValue('');
      } else {
        // Se for médico, adiciona validadores (se necessário)
        this.usuarioForm.get('medico.CRM')?.setValidators(Validators.required);
        this.usuarioForm.get('medico.especialidade')?.setValidators(Validators.required);
      }
      this.usuarioForm.get('medico.CRM')?.updateValueAndValidity();
      this.usuarioForm.get('medico.especialidade')?.updateValueAndValidity();
    });
  }

  /**
   * Carrega os dados iniciais do usuário, perfis e funcionários.
   */
  carregarDadosIniciais(): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      usuarioDetalhes: this.usuarioService.getUsuarioDetalhes(this.usuarioId),
      perfis: this.perfilService.getPerfis(),
      funcionarios: this.funcionarioService.getFuncionarios(),
    }).subscribe({
      next: (results: {
        usuarioDetalhes: UsuarioDetailsResponse,
        perfis: Perfil[],
        funcionarios: Funcionario[],
      }) => {
        const usuario = results.usuarioDetalhes.usuario;
        this.usuarioAtual = usuario; // Armazena o usuário original
        this.perfis = results.perfis;
        this.funcionarios = results.funcionarios;

        // Preenche o formulário com os dados do usuário
        this.usuarioForm.patchValue({
          username: usuario.username,
          id_perfil: usuario.id_perfil,
          id_funcionario: usuario.id_funcionario,
          ativo: usuario.ativo === 1 // Converte 0/1 para boolean
        });

        // Preenche o grupo de funcionário se houver dados
        if (usuario.funcionario) {
          this.usuarioForm.get('funcionario')?.patchValue({
            nome: usuario.funcionario.nome,
            cpf: usuario.funcionario.cpf,
            cargo: usuario.funcionario.cargo,
            email_empresarial: usuario.funcionario.email_empresarial,
            telefone_empresarial: usuario.funcionario.telefone_empresarial
          });
        }

        // Preenche o grupo de médico se houver dados e o perfil for médico
        if (usuario.medico && usuario.perfil?.nome_perfil === 'Medico') {
          this.usuarioForm.get('medico')?.patchValue({
            CRM: usuario.medico.CRM,
            especialidade: usuario.medico.especialidade
          });
        }

        // Dispara a verificação do perfil médico após preencher o id_perfil
        this.usuarioForm.get('id_perfil')?.updateValueAndValidity();
        this.usuarioForm.get('id_perfil')?.markAsDirty(); // Marca como dirty para garantir que o valueChanges seja disparado se o valor for o mesmo

        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Falha ao carregar os dados para edição.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  /**
   * Lida com o envio do formulário de edição.
   */
  onSubmit(): void {
    this.error = null;
    this.successMessage = null;

    if (this.usuarioForm.valid && this.usuarioId) {
      this.isSaving = true;
      const formValue = this.usuarioForm.value;

      // Converte o booleano 'ativo' do frontend para 0 ou 1 para o backend
      formValue.ativo = formValue.ativo ? 1 : 0;

      // Constrói o payload para a API
      const payload: UpdateUsuarioPayload = {
        username: formValue.username,
        id_perfil: formValue.id_perfil,
        id_funcionario: formValue.id_funcionario,
        ativo: formValue.ativo,
      };

      // Adiciona dados do funcionário ao payload
      if (formValue.funcionario) {
        payload.funcionario = {
          nome: formValue.funcionario.nome,
          cpf: formValue.funcionario.cpf,
          cargo: formValue.funcionario.cargo,
          email_empresarial: formValue.funcionario.email_empresarial,
          telefone_empresarial: formValue.funcionario.telefone_empresarial
        };
      }

      // Adiciona dados do médico ao payload SOMENTE se o perfil for médico
      if (this.isMedicoProfileSelected && formValue.medico) {
        payload.medico = {
          CRM: formValue.medico.CRM,
          especialidade: formValue.medico.especialidade
        };
      }

      this.usuarioService.updateUsuario(this.usuarioId, payload).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.isSaving = false;
          // Redireciona de volta para a lista após um pequeno atraso
          setTimeout(() => {
            this.router.navigate(['/administrador/funcionarios']);
          }, 2000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Erro ao atualizar usuário.';
          if (err.error?.errors) {
            // Exibir erros de validação específicos do backend
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
      this.usuarioForm.markAllAsTouched(); // Marca todos os campos como "touched" para exibir erros
      this.error = 'Por favor, preencha todos os campos obrigatórios corretamente.';
    }
  }

  /**
   * Volta para a lista de usuários na rota de administrador.
   */
  voltarAdmin(): void {
    this.router.navigate(['/administrador/funcionarios']);
  }
}