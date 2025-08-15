import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConsultasService } from '../../../controllers/consultas/consultas.service';
import { Router, RouterModule } from '@angular/router';
import { Paciente, PacientesApiResponse } from '../../../core/models/paciente.model';
import { CommonModule } from '@angular/common';
import { PacientesService } from '../../../controllers/pacientes/pacientes.service';
import { HttpClientModule } from '@angular/common/http';
import { BotaoVoltarComponent } from "../../../components/botao-voltar/botao-voltar.component";

@Component({
  selector: 'app-agendar-consulta',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule, BotaoVoltarComponent],
  templateUrl: './agendar-consulta.component.html',
  styleUrl: './agendar-consulta.component.css'
})
export class AgendarConsultaComponent implements OnInit{
  agendarForm!: FormGroup;
  pacientes: Paciente[] = [];
  isLoading = true;
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private consultasService: ConsultasService,
    private router: Router,
    private pacientesService: PacientesService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarPacientes();
  }

  initForm(): void {
    const today = new Date().toISOString().split('T')[0];
    this.agendarForm = this.fb.group({
      id_paciente: ['', Validators.required],
      data_consulta: [today, Validators.required],
      hora_inicio: ['', Validators.required],
      hora_fim: ['', Validators.required],
      descricao: ['', Validators.required],
    });
  }

  carregarPacientes(): void {
    this.isLoading = true;
    this.pacientesService.getPacientesAtivos().subscribe({
      next: (response: PacientesApiResponse) => {
        this.pacientes = response.pacientes;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Falha ao carregar a lista de pacientes.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.agendarForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    this.isSubmitting = true;
    
    this.consultasService.agendarConsulta(this.agendarForm.value).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.isSubmitting = false;
        setTimeout(() => {
          this.router.navigate(['/medico/consultas']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = 'Ocorreu um erro ao agendar a consulta.';
        this.isSubmitting = false;
        console.error(err);
      }
    });
  }
}
