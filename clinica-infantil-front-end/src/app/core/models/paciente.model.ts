import { Cliente } from './cliente.model';
import { Consulta } from './consultas.model';
import { PaginatedApiResponse } from './Paginate.model';
import { Prontuario } from './prontuarios.model';
import { Responsavel } from './responsavel.model';

export interface Paciente {
  id: number;
  id_cliente: number;
  id_responsavel: number;
  data_nascimento: string;
  historico_medico: string;
  cliente: Cliente;
  responsavel: Responsavel;
  consultas?: Consulta[];
  prontuarios?: Prontuario[];
}

export interface PacientesApiResponse {
  status: boolean;
  message: string;
  pacientes: Paciente[];
}

export interface PacienteDetailsResponse {
  status: boolean;
  message: string;
  paciente: Paciente;
}

export interface PacientesPaginadosResponse {
  status: boolean;
  message: string;
  pacientes: PaginatedApiResponse<Paciente[]>
}

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