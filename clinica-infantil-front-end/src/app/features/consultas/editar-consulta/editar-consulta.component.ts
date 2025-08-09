import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Consulta } from '../../../core/models/consultas.model';
import { ConsultasService, UpdateConsultaResponse } from '../../../controllers/consultas/consultas.service';

@Component({
  selector: 'app-editar-consulta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './editar-consulta.component.html',
  styleUrls: ['./editar-consulta.component.css']
})
export class EditarConsultaComponent implements OnInit {
  formConsulta: FormGroup;
  consulta: Consulta | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private consultasService: ConsultasService
  ) {
    this.formConsulta = this.fb.group({
      data_consulta: ['', Validators.required],
      hora_inicio: ['', Validators.required],
      hora_fim: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  get isSecretariaRoute(): boolean {
    return this.router.url.startsWith('/secretaria');
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.carregarConsulta(id);
    } else {
      this.error = 'ID da consulta não fornecido.';
      this.isLoading = false;
    }
  }

  carregarConsulta(id: number): void {
    this.consultasService.getConsultaById(id).subscribe({
      next: (response: { consulta: Consulta }) => {
        this.consulta = response.consulta;
        this.isLoading = false;
        this.preencherFormulario();
      },
      error: (err: any) => {
        this.error = 'Falha ao carregar os dados da consulta para edição.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  preencherFormulario(): void {
    if (this.consulta) {
      // Extrai apenas a data (YYYY-MM-DD) da string completa
      const dataFormatada = this.consulta.data_consulta.split(' ')[0];

      this.formConsulta.patchValue({
        data_consulta: dataFormatada,
        // Garante que a hora seja 'HH:MM' para o input type="time"
        hora_inicio: this.consulta.hora_inicio.slice(0, 5),
        hora_fim: this.consulta.hora_fim.slice(0, 5),
        status: this.consulta.status,
      });
    }
  }

  onSubmit(): void {
    if (this.formConsulta.valid && this.consulta) {
      const id = this.consulta.id;
      const dadosDoForm = this.formConsulta.value;

      // Garante que as horas tenham :00 no final, como o Laravel espera
      const horaInicioFormatada = `${dadosDoForm.hora_inicio}:00`;
      const horaFimFormatada = `${dadosDoForm.hora_fim}:00`;

      const payload = {
        id_paciente: this.consulta.id_paciente,
        id_medico: this.consulta.id_medico,
        // Converte o valor do status para minúsculas antes de enviar
        status: dadosDoForm.status.toLowerCase(),
        descricao: this.consulta.descricao,
        // O Laravel aceita 'YYYY-MM-DD' para o campo 'date'
        data_consulta: dadosDoForm.data_consulta,
        hora_inicio: horaInicioFormatada,
        hora_fim: horaFimFormatada
      };

      this.consultasService.updateConsulta(id, payload).subscribe({
        next: (response: UpdateConsultaResponse) => { // Use o tipo correto para a resposta
          console.log('Consulta atualizada com sucesso!', response);
          this.router.navigate(['/secretaria/consultas']);
        },
        error: (err: any) => {
          let mensagemErro = 'Falha ao atualizar a consulta.';
          
          if (err.error && err.error.errors) {
            mensagemErro += ' Erros de validação:';
            for (const campo in err.error.errors) {
              if (err.error.errors.hasOwnProperty(campo)) {
                mensagemErro += `\n- ${campo}: ${err.error.errors[campo].join(', ')}`;
              }
            }
          } else if (err.error && err.error.message) {
            mensagemErro += ` Detalhes: ${err.error.message}`;
          }
          
          this.error = mensagemErro;
          console.error('Erro detalhado:', err);
        }
      });
    }
  }
}