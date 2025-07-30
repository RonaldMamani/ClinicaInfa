import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Paciente {
  id: number;
  nome: string;
  dataNascimento: string;
  genero: string;
  telefone: string;
  email: string;
}

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './paciente-list.component.html',
  styleUrls: ['./paciente-list.component.css']
})
export class PacienteListComponent implements OnInit {
  // Dados mockados para exibição
  pacientes: Paciente[] = [
    { id: 1, nome: 'Ana Silva', dataNascimento: '15/03/1990', genero: 'Feminino', telefone: '(11) 98765-4321', email: 'ana.s@example.com' },
    { id: 2, nome: 'Bruno Costa', dataNascimento: '22/07/1985', genero: 'Masculino', telefone: '(21) 99876-5432', email: 'bruno.c@example.com' },
    { id: 3, nome: 'Carla Pereira', dataNascimento: '01/11/2000', genero: 'Feminino', telefone: '(31) 97654-3210', email: 'carla.p@example.com' },
    { id: 4, nome: 'Daniel Almeida', dataNascimento: '10/04/1978', genero: 'Masculino', telefone: '(41) 98765-1234', email: 'daniel.a@example.com' },
    { id: 5, nome: 'Eduarda Santos', dataNascimento: '29/09/1995', genero: 'Feminino', telefone: '(51) 99123-4567', email: 'eduarda.s@example.com' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  // Métodos simulados para ações (apenas para o visual)
  editarPaciente(id: number): void {
    console.log('Editar paciente:', id);
    // Futuramente, navegar para a tela de edição
  }

  excluirPaciente(id: number): void {
    console.log('Excluir paciente:', id);
    // Futuramente, chamar o serviço de exclusão e atualizar a lista
  }
}