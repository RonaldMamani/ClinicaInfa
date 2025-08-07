import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ConsultasService } from '../../../controllers/consultas/consultas.service';
import { Paciente, PacientesApiResponse } from '../../../core/models/paciente.model';
import { CommonModule } from '@angular/common';
import { Medico } from '../../../core/models/medico.model';
import { forkJoin } from 'rxjs';
import { PacientesService } from '../../../controllers/pacientes/pacientes.service';
import { MedicosService } from '../../../controllers/medicos/medicos.service';

@Component({
  selector: 'app-adicionar-consulta',
  templateUrl: './adicionar-consulta.component.html',
  styleUrls: ['./adicionar-consulta.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ]
})
export class AdicionarConsultaComponent implements OnInit {
  criarForm: FormGroup;
  pacientes: Paciente[] = [];
  medicos: Medico[] = [];
  isLoading = true;
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private consultasService: ConsultasService,
    private pacientesService: PacientesService,
    private medicosService: MedicosService
  ) {
    this.criarForm = this.fb.group({
      id_paciente: ['', Validators.required],
      id_medico: ['', Validators.required],
      data_consulta: ['', Validators.required],
      hora_inicio: ['', Validators.required],
      hora_fim: ['', Validators.required],
      descricao: [''],
      status: ['agendada'],
    });
  }

  ngOnInit(): void {
    this.carregarDadosIniciais();
  }

  carregarDadosIniciais(): void {
    this.isLoading = true;
    this.errorMessage = null;

    forkJoin({
      pacientes: this.pacientesService.getPacientes(),
      medicos: this.medicosService.GetMedicos()
    }).subscribe({
      next: (results) => {
        this.pacientes = results.pacientes;
        this.medicos = results.medicos;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Falha ao carregar os dados. Verifique a conexão com a API ou as permissões de acesso.';
        this.isLoading = false;
        console.error('Erro ao carregar dados iniciais:', err);
      }
    });
  }

  // Novo método para formatar a hora para HH:MM:SS
  private formatTime(timeString: string): string {
    if (!timeString) {
      return '';
    }
    // Adiciona ':00' se a string não contiver segundos
    if (timeString.split(':').length === 2) {
      return `${timeString}:00`;
    }
    return timeString;
  }

  onSubmit(): void {
    if (this.criarForm.valid) {
      this.isSubmitting = true;
      this.successMessage = null;
      this.errorMessage = null;

      const dados = { ...this.criarForm.value };

      // CORRIGIDO: Usa o método auxiliar para garantir o formato correto
      dados.hora_inicio = this.formatTime(dados.hora_inicio);
      dados.hora_fim = this.formatTime(dados.hora_fim);

      this.consultasService.criarConsulta(dados).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.successMessage = response.message || 'Consulta criada com sucesso!';
          this.criarForm.reset({ status: 'agendada' });
          setTimeout(() => {
            this.router.navigate(['/secretaria']);
          }, 3000);
        },
        error: (err) => {
          this.isSubmitting = false;
          if (err.error && err.error.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Erro ao criar a consulta. Tente novamente.';
          }
          console.error('Erro de criação:', err);
        }
      });
    }
  }
}