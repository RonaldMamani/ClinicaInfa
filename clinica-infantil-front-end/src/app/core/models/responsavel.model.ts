import { Cliente } from './cliente.model';
import { Paciente } from './paciente.model';

export interface Responsavel {
  id: number;
  id_cliente: number;
  grau_parentesco: string;
  email: string;
  telefone: string;
  cliente: Cliente;
  pacientes: Paciente[];
}

export interface ResponsaveisApiResponse {
  status: boolean;
  message: string;
  responsaveis: Responsavel[];
}

export interface ResponsavelDetailsResponse {
  status: boolean;
  message: string;
  responsavel: Responsavel;
}

export interface UpdateResponsavelPayload {
  grau_parentesco?: string;
  email?: string;
  telefone?: string;
}