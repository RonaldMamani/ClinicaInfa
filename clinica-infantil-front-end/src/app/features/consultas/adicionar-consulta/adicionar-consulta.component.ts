// src/app/features/adicionar-consulta/adicionar-consulta.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsultasService } from '../../../controllers/consultas/consultas.service';
import { Consulta } from '../../../core/models/consultas.model';
import { MedicosService } from '../../../controllers/medicos/medicos.service';
import { PacientesService } from '../../../controllers/pacientes/pacientes.service';
import { finalize } from 'rxjs/operators';
import { PacientesApiResponse } from '../../../core/models/paciente.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adicionar-consulta',
  templateUrl: './adicionar-consulta.component.html',
  styleUrls: ['./adicionar-consulta.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class AdicionarConsultaComponent implements OnInit {
  formularioConsulta: FormGroup;
  pacientes: any[] = [];
  medicos: any[] = [];
  estaCarregando = false;
  mensagemSucesso: string | null = null;
  mensagemErro: string | null = null;

  constructor(
    private fb: FormBuilder,
    private consultaService: ConsultasService,
    private pacientesService: PacientesService,
    private medicosService: MedicosService,
    private router: Router
  ) {
    // Inicializamos o formulário reativo com FormBuilder
    this.formularioConsulta = this.fb.group({
      id_paciente: [null, Validators.required],
      id_medico: [null, Validators.required],
      data_consulta: ['', Validators.required],
      hora_inicio: ['', Validators.required],
      hora_fim: ['', Validators.required],
      status: ['agendada', Validators.required],
      descricao: ['']
    });
  }

  ngOnInit(): void {
    // Carrega a lista de pacientes da API
    this.pacientesService.getPacientes().subscribe({
      next: (resposta: PacientesApiResponse) => {
        this.pacientes = resposta.pacientes;
      },
      error: (erro) => {
        console.error('Erro ao carregar pacientes:', erro);
        this.mensagemErro = 'Não foi possível carregar a lista de pacientes.';
      }
    });

    // Carrega a lista de médicos da API
    this.medicosService.getMedicos().subscribe({
      next: (resposta) => {
        this.medicos = resposta.medicos;
      },
      error: (erro) => {
        console.error('Erro ao carregar médicos:', erro);
        this.mensagemErro = 'Não foi possível carregar a lista de médicos.';
      }
    });
  }

  /**
   * Método chamado ao enviar o formulário.
   */
  enviarFormulario() {
    this.mensagemErro = null;
    this.mensagemSucesso = null;

    if (this.formularioConsulta.invalid) {
      this.mensagemErro = 'Por favor, preencha todos os campos obrigatórios corretamente.';
      return;
    }

    this.estaCarregando = true;
    const novaConsulta: Consulta = this.formularioConsulta.value;

    this.consultaService.adicionarConsulta(novaConsulta)
      .pipe(
        finalize(() => this.estaCarregando = false)
      )
      .subscribe({
        next: (response) => {
          this.mensagemSucesso = 'Consulta agendada com sucesso!';
          this.formularioConsulta.reset({ status: 'agendada' });
          setTimeout(() => {
            this.router.navigate(['/consultas']);
          }, 2000);
        },
        error: (error) => {
          this.mensagemErro = error.message || 'Erro ao agendar a consulta.';
        }
      });
  }
}