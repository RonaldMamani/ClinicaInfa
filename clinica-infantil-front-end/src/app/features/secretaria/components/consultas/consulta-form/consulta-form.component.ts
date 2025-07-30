import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necessário para [(ngModel)]
import { Router } from '@angular/router'; // Para navegação após agendamento

// Mock de dados para simular Agendamento, Pacientes e Médicos
interface ConsultaFormModel {
  pacienteId: number | null;
  medicoId: number | null;
  dataConsulta: string;
  horaConsulta: string;
  observacoes: string;
}

interface MockPaciente {
  id: number;
  nome: string;
}

interface MockMedico {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-consulta-form',
  standalone: true,
  imports: [CommonModule, FormsModule], // Adicione FormsModule
  templateUrl: './consulta-form.component.html',
  styleUrls: ['./consulta-form.component.css']
})
export class ConsultaFormComponent implements OnInit {
  consulta: ConsultaFormModel = {
    pacienteId: null,
    medicoId: null,
    dataConsulta: '',
    horaConsulta: '',
    observacoes: ''
  };

  pacientes: MockPaciente[] = [
    { id: 1, nome: 'Ana Silva' },
    { id: 2, nome: 'Bruno Costa' },
    { id: 3, nome: 'Carla Pereira' },
  ];

  medicos: MockMedico[] = [
    { id: 101, nome: 'Dr. João Mendes' },
    { id: 102, nome: 'Dra. Maria Oliveira' },
    { id: 103, nome: 'Dr. Pedro Santos' },
  ];

  // Mensagens de feedback (apenas visual)
  agendamentoSucesso: boolean = false;
  agendamentoErro: string | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Pode pré-popular a data atual aqui
    this.consulta.dataConsulta = new Date().toISOString().substring(0, 10);
  }

  agendarConsulta(): void {
    console.log('Dados da consulta (apenas visual):', this.consulta);
    this.agendamentoSucesso = false;
    this.agendamentoErro = null;

    // Simular sucesso ou erro
    if (this.consulta.pacienteId && this.consulta.medicoId && this.consulta.dataConsulta && this.consulta.horaConsulta) {
      this.agendamentoSucesso = true;
      setTimeout(() => {
        // Resetar formulário ou redirecionar após um tempo
        this.agendamentoSucesso = false;
        this.consulta = { pacienteId: null, medicoId: null, dataConsulta: new Date().toISOString().substring(0, 10), horaConsulta: '', observacoes: '' };
        this.router.navigate(['/secretaria/consultas']); // Redireciona para a lista de consultas
      }, 2000);
    } else {
      this.agendamentoErro = 'Por favor, preencha todos os campos obrigatórios.';
    }
  }

  voltar(): void {
    this.router.navigate(['/secretaria/consultas']); // Exemplo: voltar para lista de consultas
  }
}