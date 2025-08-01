// src/app/core/models/paciente.model.ts
import { Cliente, Cidade, Genero } from './cliente.model';
import { Responsavel } from './responsavel.model';

// Representa a estrutura do objeto 'cliente' com as cidades e gêneros aninhados
export interface ClienteComDetalhes extends Cliente {
  cidade: Cidade;
  genero: Genero;
}

// Representa o objeto completo de um paciente, incluindo o cliente e o responsável
// O tipo do 'responsavel' é o simples 'Responsavel' que não tem o cliente aninhado
export interface Paciente {
  id: number;
  id_cliente: number;
  id_responsavel: number;
  data_nascimento: string;
  historico_medico: string;
  cliente: ClienteComDetalhes;
  responsavel: Responsavel;
}

// Representa a resposta completa da API para a lista de pacientes
export interface PacientesApiResponse {
  status: boolean;
  message: string;
  pacientes: Paciente[];
}

// Representa a resposta da API para um único paciente
export interface PacienteDetailsResponse {
  status: boolean;
  message: string;
  paciente: Paciente;
}

// Payload para a criação/atualização de um paciente
export interface UpdatePacientePayload {
  nome: string;
  cpf: string;
  rg: string;
  endereco: string;
  id_cidade: number;
  id_genero: number;
  data_nascimento: string;
  historico_medico: string;
  id_responsavel: number;
  ativo: boolean;
}

export interface PatientsCountResponse {
  status: boolean;
  message: string;
  total: number;
}