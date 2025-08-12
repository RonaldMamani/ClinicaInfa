import { Component } from '@angular/core';
import { Consulta, ConsultaDetailsResponse } from '../../../core/models/consultas.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConsultasService, UpdateConsultaResponse } from '../../../controllers/consultas/consultas.service';
import { CommonModule } from '@angular/common';
import { ProntuariosService } from '../../../controllers/prontuarios/prontuarios.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-atender-consulta',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './atender-consulta.component.html',
  styleUrl: './atender-consulta.component.css'
})
export class AtenderConsultaComponent {
  consulta: Consulta | null = null;
  prontuarioExistente: boolean = false;
  atenderConsultaForm: FormGroup;
  isLoading = true;
  isSubmitting = false;
  error: string | null = null;
  successMessage: string | null = null;
  private consultaId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consultasService: ConsultasService,
    private prontuarioService: ProntuariosService,
    private fb: FormBuilder
  ) {
    this.atenderConsultaForm = this.fb.group({
      descricao: ['', [Validators.required, Validators.maxLength(1000)]],
      data_diagnostico: ['', [Validators.required]],
      diagnostico: ['', [Validators.required, Validators.maxLength(1000)]],
      prescricao: [''],
      observacoes: [''],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.consultaId = +id;
      this.carregarDetalhesDaConsulta(this.consultaId);
    } else {
      this.error = 'ID da consulta não fornecido na URL.';
      this.isLoading = false;
    }
  }

  carregarDetalhesDaConsulta(id: number): void {
    this.isLoading = true;
    this.consultasService.getConsultaById(id).subscribe({
      next: (response: ConsultaDetailsResponse) => {
        this.consulta = response.consulta;
        this.atenderConsultaForm.patchValue({
          descricao: this.consulta?.descricao,
        });
        this.verificarEPreencherProntuarioExistente(this.consulta.paciente.id);
      },
      error: (err) => {
        this.error = 'Falha ao carregar os detalhes da consulta.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  verificarEPreencherProntuarioExistente(pacienteId: number): void {
    this.prontuarioService.getProntuarioByPacienteId(pacienteId).subscribe({
      next: (response: any) => {
        if (response && response.prontuario) {
          this.prontuarioExistente = true;
          this.atenderConsultaForm.patchValue({
            data_diagnostico: response.prontuario.data_diagnostico,
            diagnostico: response.prontuario.diagnostico,
            prescricao: response.prontuario.prescricao,
            observacoes: response.prontuario.observacoes,
          });
        } else {
          this.prontuarioExistente = false;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Falha ao verificar a existência do prontuário.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.atenderConsultaForm.valid && this.consultaId) {
      this.isSubmitting = true;
      this.error = null;
      this.successMessage = null;

      const formValue = this.atenderConsultaForm.value;
      const payload: any = {
        descricao: formValue.descricao,
        prontuario: {
          data_diagnostico: formValue.data_diagnostico,
          diagnostico: formValue.diagnostico,
          prescricao: formValue.prescricao,
          observacoes: formValue.observacoes,
        }
      };
      
      this.consultasService.concluirConsulta(this.consultaId, payload).subscribe({
        next: (response: UpdateConsultaResponse) => {
          this.isSubmitting = false;
          this.successMessage = response.message;
          setTimeout(() => {
            this.router.navigate(['/medico']);
          }, 3000);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.error = 'Ocorreu um erro ao concluir a consulta. ' + (err.error?.message || '');
          console.error(err);
        }
      });
    } else {
      this.atenderConsultaForm.markAllAsTouched();
      this.error = 'Por favor, preencha todos os campos obrigatórios.';
    }
  }
}