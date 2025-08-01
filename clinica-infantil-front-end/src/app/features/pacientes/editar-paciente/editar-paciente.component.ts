import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PacientesService } from '../pacientes.service';
import { ClientesService } from '../../clientes/clientes.service';
import { ResponsaveisService } from '../../responsaveis/responsaveis.service';
import { Paciente, UpdatePacientePayload } from '../../../core/models/paciente.model';
import { UpdateClientePayload } from '../../../core/models/cliente.model';
import { UpdateResponsavelPayload } from '../../../core/models/responsavel.model';

@Component({
  selector: 'app-editar-paciente',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './editar-paciente.component.html',
  styleUrls: ['./editar-paciente.component.css']
})
export class EditarPacienteComponent implements OnInit {
  pacienteForm!: FormGroup;
  pacienteId: number | null = null;
  isLoading: boolean = true;
  isSaving: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;

  private currentPacienteData: Paciente | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private pacientesService: PacientesService,
    private clientesService: ClientesService,
    private responsaveisService: ResponsaveisService
  ) { }

  ngOnInit(): void {
    this.pacienteForm = this.fb.group({
      data_nascimento: ['', Validators.required],
      historico_medico: ['', Validators.required],
      cliente: this.fb.group({
        nome: ['', Validators.required],
        cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
        rg: [''],
        endereco: ['', Validators.required],
        id_cidade: ['', Validators.required],
        id_genero: ['', Validators.required],
      }),
      responsavel: this.fb.group({
        cliente: this.fb.group({
          nome: ['', Validators.required]
        }),
        grau_parentesco: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      })
    });

    this.route.paramMap.subscribe(params => {
      this.pacienteId = Number(params.get('id'));
      if (this.pacienteId) {
        this.loadPacienteData(this.pacienteId);
      } else {
        this.error = 'ID do paciente não fornecido na URL para edição.';
        this.isLoading = false;
      }
    });
  }

  loadPacienteData(id: number): void {
    this.isLoading = true;
    this.pacientesService.getPacienteById(id).subscribe({
      next: (response) => {
        if (response.status && response.paciente) {
          this.currentPacienteData = response.paciente;

          if (this.currentPacienteData.responsavel && this.currentPacienteData.responsavel.id_cliente) {
            this.clientesService.getClienteById(this.currentPacienteData.responsavel.id_cliente).subscribe({
              next: (clienteResp) => {
                if (clienteResp.status && clienteResp.cliente) {
                  this.pacienteForm.patchValue({
                    responsavel: {
                      cliente: {
                        nome: clienteResp.cliente.nome
                      }
                    }
                  });
                }
                this.fillPatientDataInForm(response.paciente);
                this.isLoading = false;
              },
              error: (err) => {
                console.error('Erro ao buscar cliente do responsável:', err);
                this.fillPatientDataInForm(response.paciente);
                this.isLoading = false;
              }
            });
          } else {
            this.fillPatientDataInForm(response.paciente);
            this.isLoading = false;
          }
        } else {
          this.error = response.message || 'Paciente não encontrado para edição.';
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.error = 'Erro ao carregar dados do paciente para edição.';
        console.error('Erro na requisição HTTP:', err);
        this.isLoading = false;
      }
    });
  }

  private fillPatientDataInForm(paciente: Paciente): void {
    this.pacienteForm.patchValue({
      data_nascimento: paciente.data_nascimento,
      historico_medico: paciente.historico_medico,
      cliente: {
        nome: paciente.cliente.nome,
        cpf: paciente.cliente.cpf,
        rg: paciente.cliente.rg,
        endereco: paciente.cliente.endereco,
        id_cidade: paciente.cliente.id_cidade,
        id_genero: paciente.cliente.id_genero,
      },
      responsavel: {
        grau_parentesco: paciente.responsavel.grau_parentesco,
        email: paciente.responsavel.email,
        telefone: paciente.responsavel.telefone,
      }
    });
  }

  onSubmit(): void {
    this.successMessage = null;
    this.error = null;
    if (this.pacienteForm.valid && this.pacienteId && this.currentPacienteData) {
      this.isSaving = true;

      const pacientePayload: UpdatePacientePayload = {
        data_nascimento: this.pacienteForm.get('data_nascimento')?.value,
        historico_medico: this.pacienteForm.get('historico_medico')?.value,
        id_cliente: this.currentPacienteData.id_cliente,
        id_responsavel: this.currentPacienteData.id_responsavel,
      };

      const clienteId = this.currentPacienteData.cliente.id;
      const clientePayload: UpdateClientePayload = this.pacienteForm.get('cliente')?.value;

      const responsavelId = this.currentPacienteData.responsavel.id;
      const responsavelPayload: UpdateResponsavelPayload = {
        grau_parentesco: this.pacienteForm.get('responsavel.grau_parentesco')?.value,
        email: this.pacienteForm.get('responsavel.email')?.value,
        telefone: this.pacienteForm.get('responsavel.telefone')?.value
      };
      
      const responsavelClienteId = this.currentPacienteData.responsavel.id_cliente;
      const responsavelClientePayload: UpdateClientePayload = this.pacienteForm.get('responsavel.cliente')?.value;

      this.pacientesService.updatePaciente(this.pacienteId, pacientePayload).subscribe({
        next: (pacienteRes) => {
          if (pacienteRes.status) {
            console.log('Paciente principal atualizado.');
            this.clientesService.updateCliente(clienteId, clientePayload).subscribe({
              next: (clienteRes) => {
                if (clienteRes.status) {
                  console.log('Cliente atualizado.');
                  this.responsaveisService.updateResponsavel(responsavelId, responsavelPayload).subscribe({
                    next: (responsavelRes) => {
                      if (responsavelRes.status) {
                        this.clientesService.updateCliente(responsavelClienteId, responsavelClientePayload).subscribe({
                          next: (respClienteRes) => {
                            if (respClienteRes.status) {
                              this.successMessage = 'Paciente e dados associados atualizados com sucesso!';
                              console.log('Responsável e cliente do responsável atualizados.');
                              this.router.navigate(['/secretaria/pacientes/', this.pacienteId]);
                            } else {
                              this.error = respClienteRes.message || 'Erro ao atualizar cliente do responsável.';
                            }
                            this.isSaving = false;
                          },
                          error: (err) => {
                            this.error = 'Erro na requisição para atualizar cliente do responsável.';
                            console.error('Erro ao atualizar cliente do responsável:', err);
                            this.isSaving = false;
                          }
                        });
                      } else {
                        this.error = responsavelRes.message || 'Erro ao atualizar responsável.';
                        this.isSaving = false;
                      }
                    },
                    error: (err) => {
                      this.error = 'Erro na requisição para atualizar responsável.';
                      console.error('Erro ao atualizar responsável:', err);
                      this.isSaving = false;
                    }
                  });
                } else {
                  this.error = clienteRes.message || 'Erro ao atualizar cliente.';
                  this.isSaving = false;
                }
              },
              error: (err) => {
                this.error = 'Erro na requisição para atualizar cliente.';
                console.error('Erro ao atualizar cliente:', err);
                this.isSaving = false;
              }
            });
          } else {
            this.error = pacienteRes.message || 'Erro ao atualizar paciente principal.';
            this.isSaving = false;
          }
        },
        error: (err) => {
          this.error = 'Erro na requisição para atualizar paciente principal.';
          console.error('Erro ao atualizar paciente principal:', err);
          this.isSaving = false;
        }
      });
    } else {
      this.error = 'Por favor, preencha todos os campos obrigatórios corretamente.';
    }
  }
}