import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { ConsultasService } from '../../../controllers/consultas/consultas.service';
import { Consulta, ConsultaDetailsResponse } from '../../../core/models/consultas.model';

@Component({
  selector: 'app-remarcar-consulta',
  templateUrl: './remarcar-consulta.component.html',
  styleUrls: ['./remarcar-consulta.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class RemarcarConsultaComponent implements OnInit {
  remarcarForm: FormGroup;
  consulta: Consulta | null = null;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  
  private consultaId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private consultasService: ConsultasService,
    private datePipe: DatePipe // Adicione DatePipe para formatar a data
  ) {
    this.remarcarForm = this.fb.group({
      data_consulta: ['', Validators.required],
      hora_inicio: ['', Validators.required],
      hora_fim: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Pega o ID da consulta da URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.consultaId = +id;
        this.carregarDadosDaConsulta(this.consultaId);
      } else {
        this.errorMessage = 'ID da consulta não fornecido.';
      }
    });
  }

  carregarDadosDaConsulta(id: number): void {
    this.isLoading = true;
    this.consultasService.getConsultaAgendadaById(id).subscribe({
      next: (response: ConsultaDetailsResponse) => {
        this.consulta = response.consulta;
        this.isLoading = false;
        // Preenche o formulário com a data e horários atuais da consulta
        this.remarcarForm.patchValue({
          data_consulta: this.formatarDataParaInput(this.consulta.data_consulta),
          hora_inicio: this.consulta.hora_inicio,
          hora_fim: this.consulta.hora_fim
        });
      },
      error: (err) => {
        this.errorMessage = 'Falha ao carregar os dados da consulta.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.remarcarForm.valid && this.consultaId) {
      this.isLoading = true;
      this.successMessage = null;
      this.errorMessage = null;

      const dados = this.remarcarForm.value;

      this.consultasService.remarcarConsulta(this.consultaId, dados).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = response.message || 'Consulta remarcada com sucesso!';
          // Após 3 segundos, redireciona para a tela de detalhes ou para a lista
          setTimeout(() => {
            this.router.navigate(['/secretaria/consultas']);
          }, 3000);
        },
        error: (err) => {
          this.isLoading = false;
          if (err.error && err.error.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Erro ao remarcar a consulta. Tente novamente.';
          }
          console.error('Erro de remarcação:', err);
        }
      });
    }
  }

  // Formata a data para o formato YYYY-MM-DD exigido pelo input 'date'
  private formatarDataParaInput(dataString: string): string {
    return dataString ? dataString.split(' ')[0] : '';
  }
}
