import { Cliente } from './cliente.model';

export interface Responsavel {
  id: number;
  id_cliente: number;
  grau_parentesco: string;
  email: string;
  telefone: string;
}

export interface ResponsavelComCliente extends Responsavel {
  cliente: Cliente;
}

export interface ResponsaveisApiResponse {
  status: boolean;
  message: string;
  responsaveis: ResponsavelComCliente[];
}

export interface ResponsavelDetailsResponse {
  status: boolean;
  message: string;
  responsavel: ResponsavelComCliente;
}

export interface UpdateResponsavelPayload {
  grau_parentesco?: string;
  email?: string;
  telefone?: string;
}