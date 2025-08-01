import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PacientesService } from '../pacientes.service';
import { ClientesService } from '../../clientes/clientes.service';
import { Paciente } from '../../../core/models/paciente.model';

@Component({
  selector: 'app-detalhe-paciente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalhe-paciente.component.html',
  styleUrls: ['./detalhe-paciente.component.css']
})
export class DetalhePacienteComponent implements OnInit {
  paciente: Paciente | null = null;
  nomeResponsavel: string = '';
  isLoading = true;
  error: string | null = null;
  idade: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacientesService: PacientesService,
    private clientesService: ClientesService
  ) { }

  ngOnInit(): void {
    const pacienteId = +this.route.snapshot.paramMap.get('id')!;
    if (pacienteId) {
      this.carregarDetalhesDoPaciente(pacienteId);
    }
  }

  carregarDetalhesDoPaciente(id: number): void {
    this.isLoading = true;
    this.error = null;
    this.pacientesService.getPacienteById(id).subscribe({
      next: (response) => {
        if (response && response.paciente) {
          this.paciente = response.paciente;
          this.calcularIdade();
          
          // Busca o nome do responsável usando o id_cliente
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

  voltar(): void {
    this.router.navigate(['/secretaria/pacientes']);
  }
}