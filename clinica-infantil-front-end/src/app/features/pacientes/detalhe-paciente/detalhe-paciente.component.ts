import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PacientesService } from '../../../controllers/pacientes/pacientes.service';
import { ClientesService } from '../../../controllers/clientes/clientes.service';
import { EstadosService } from '../../../controllers/estados/estados.service';
import { Paciente } from '../../../core/models/paciente.model';
import { forkJoin } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { BotaoVoltarComponent } from "../../../components/botao-voltar/botao-voltar.component";

@Component({
  selector: 'app-detalhe-paciente',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BotaoVoltarComponent],
  templateUrl: './detalhe-paciente.component.html',
  styleUrls: ['./detalhe-paciente.component.css']
})
export class DetalhePacienteComponent implements OnInit {
  paciente: Paciente | null = null;
  nomeResponsavel: string = '';
  estadoSigla: string = '';
  isLoading = true;
  error: string | null = null;
  idade: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacientesService: PacientesService,
    private clientesService: ClientesService,
    private estadosService: EstadosService
  ) { }

  get isAdministradorRoute(): boolean {
    return this.router.url.startsWith('/administrador');
  }

  ngOnInit(): void {
    const pacienteId = +this.route.snapshot.paramMap.get('id')!;
    if (pacienteId) {
      this.carregarDetalhesDoPaciente(pacienteId);
    }
  }

  carregarDetalhesDoPaciente(id: number): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      pacienteResponse: this.pacientesService.getPacienteById(id),
      estados: this.estadosService.getEstados()
    }).subscribe({
      next: (results) => {
        const response = results.pacienteResponse;
        const estados = results.estados;

        if (response && response.paciente) {
          this.paciente = response.paciente;
          this.calcularIdade();

          // Encontrar a sigla do estado
          const estado = estados.find(e => e.id === this.paciente?.cliente.cidade?.id_estado);
          this.estadoSigla = estado ? estado.sigla : 'Estado não encontrado';

          // Busca o nome do responsável
          this.clientesService.getClienteById(this.paciente.responsavel.id_cliente).subscribe({
            next: (clienteResponse) => {
              this.nomeResponsavel = clienteResponse.cliente.nome;
              this.isLoading = false;
            },
            error: (err) => {
              this.error = 'Falha ao carregar o nome do responsável.';
              this.isLoading = false;
              console.error(err);
            }
          });
        } else {
          this.error = 'Detalhes do paciente não encontrados.';
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.error = 'Falha ao carregar os detalhes do paciente.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  calcularIdade(): void {
    if (this.paciente?.data_nascimento) {
      const dataNascimento = new Date(this.paciente.data_nascimento);
      const diff = Date.now() - dataNascimento.getTime();
      this.idade = Math.abs(new Date(diff).getUTCFullYear() - 1970);
    }
  }

  voltarSecretaria(): void {
    this.router.navigate(['/secretaria/pacientes']);
  }

  voltarAdmin(): void {
    this.router.navigate(['/administrador/pacientes']);
  }
}