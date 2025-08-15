import { Component } from '@angular/core';
import { CreateUsuarioPayload } from '../../../core/models/usuario.model';
import { Funcionario } from '../../../core/models/funcionario.model';
import { Perfil } from '../../../core/models/perfil.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from '../../../controllers/usuarios/usuarios.service';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { InputMaskDirective } from '../../../shared/input-mask-directive';
import { PerfisService } from '../../../controllers/perfis/perfis.service';
import { FuncionariosService } from '../../../controllers/funcionarios/funcionarios.service';
import { HttpClientModule } from '@angular/common/http';
import { BotaoVoltarComponent } from "../../../components/botao-voltar/botao-voltar.component";

@Component({
  selector: 'app-adicionar-funcionario',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, InputMaskDirective, HttpClientModule, BotaoVoltarComponent],
  templateUrl: './adicionar-funcionario.component.html',
  styleUrl: './adicionar-funcionario.component.css'
})
export class AdicionarFuncionarioComponent {
  usuarioForm!: FormGroup;
  isLoading = true;
 isSaving = false;
 error: string | null = null;
 successMessage: string | null = null;

 perfis: Perfil[] = [];
 funcionarios: Funcionario[] = [];
 
 medicoProfileId: number | null = null; // AQUI: Adiciona a propriedade para o ID do perfil de médico
 isMedicoProfileSelected: boolean = false;

 constructor(
  private fb: FormBuilder,
  private router: Router,
  private usuarioService: UsuariosService,
  private perfilService: PerfisService,
  private funcionarioService: FuncionariosService
 ) { }

 ngOnInit(): void {
  this.usuarioForm = this.fb.group({
   username: ['', Validators.required],
   senha: ['', [Validators.required, Validators.minLength(8)]],
   id_perfil: ['', Validators.required],
   ativo: [true],

   funcionario: this.fb.group({
    nome: ['', Validators.required],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
    cargo: ['', Validators.required],
    email_empresarial: ['', [Validators.required, Validators.email]],
    telefone_empresarial: ['', Validators.required]
   }),

   medico: this.fb.group({
    CRM: [''],
    especialidade: ['']
   })
  });

  this.carregarDadosIniciais();

  // Observa mudanças no perfil selecionado
  this.usuarioForm.get('id_perfil')?.valueChanges.subscribe(perfilId => {
   // AQUI: Usa a propriedade dinâmica para verificar se o perfil é de médico
   this.isMedicoProfileSelected = (perfilId == this.medicoProfileId); 

   if (!this.isMedicoProfileSelected) {
    // Limpa validadores e valores dos campos de médico
    this.usuarioForm.get('medico.CRM')?.clearValidators();
    this.usuarioForm.get('medico.especialidade')?.clearValidators();
    this.usuarioForm.get('medico.CRM')?.setValue('');
    this.usuarioForm.get('medico.especialidade')?.setValue('');
   } else {
    // Adiciona validadores aos campos de médico
    this.usuarioForm.get('medico.CRM')?.setValidators(Validators.required);
    this.usuarioForm.get('medico.especialidade')?.setValidators(Validators.required);
   }
   this.usuarioForm.get('medico.CRM')?.updateValueAndValidity();
   this.usuarioForm.get('medico.especialidade')?.updateValueAndValidity();
  });
 }

 /**
   * Carrega os dados iniciais (perfis e funcionários existentes).
   */
 carregarDadosIniciais(): void {
  this.isLoading = true;
  this.error = null;

 forkJoin({
   perfis: this.perfilService.getPerfis(),
   funcionarios: this.funcionarioService.getFuncionarios(),
  }).subscribe({
   next: (results: { perfis: Perfil[], funcionarios: Funcionario[] }) => {
    this.perfis = results.perfis;
    this.funcionarios = results.funcionarios;
    
    // AQUI: Encontra o ID do perfil de médico pelo nome e armazena na propriedade
    const medicoProfile = this.perfis.find(perfil => perfil.nome_perfil === 'Medico');
    if (medicoProfile) {
     this.medicoProfileId = medicoProfile.id;
    }

    this.isLoading = false;
   },
   error: (err) => {
    this.error = err.message || 'Falha ao carregar dados iniciais.';
    this.isLoading = false;
    console.error(err);
   }
  });
 }

/**
   * Lida com o envio do formulário de adição.
   */
 onSubmit(): void {
  this.error = null;
  this.successMessage = null;

  if (this.usuarioForm.valid) {
   this.isSaving = true;
   const formValue = this.usuarioForm.value;

   const payload: CreateUsuarioPayload = {
    username: formValue.username,
    senha: formValue.senha,
    id_perfil: formValue.id_perfil,
    ativo: formValue.ativo,
    funcionario: {
     nome: formValue.funcionario.nome,
     cpf: formValue.funcionario.cpf,
     cargo: formValue.funcionario.cargo,
     email_empresarial: formValue.funcionario.email_empresarial,
     telefone_empresarial: formValue.funcionario.telefone_empresarial
    }
   };

   if (this.isMedicoProfileSelected && formValue.medico) {
    // Verifica se os campos de médico têm valores antes de adicionar ao payload
    if (formValue.medico.CRM && formValue.medico.especialidade) {
     payload.medico = {
      CRM: formValue.medico.CRM,
      especialidade: formValue.medico.especialidade
     };
    } else {
     // Se o perfil for médico, mas os campos estão vazios,
     // o formulário já deveria estar inválido. Apenas um fallback.
     this.isSaving = false;
     this.error = 'Por favor, preencha os dados do médico.';
     return;
    }
   }

   this.usuarioService.createUsuario(payload).subscribe({
    next: (response) => {
     this.successMessage = response.message;
     this.isSaving = false;
     this.usuarioForm.reset({ ativo: true });
     setTimeout(() => {
      this.router.navigate(['/administrador/funcionarios']);
     }, 2000);
    },
    error: (err) => {
     this.error = err.error?.message || 'Erro ao adicionar usuário.';
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
 this.usuarioForm.markAllAsTouched();
    this.error = 'Por favor, preencha todos os campos obrigatórios corretamente.';
 } }

 /**
   * Volta para a lista de usuários na rota de administrador.
   */
 voltarAdmin(): void {
 this.router.navigate(['/administrador/funcionarios']);
 }
}
