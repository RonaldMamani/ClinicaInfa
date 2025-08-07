import { Cliente } from "./cliente.model";
import { Paciente } from "./paciente.model";

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
  grau_parentesco: string;
  email: string;
  telefone: string;
}

// Interfaces de paginação (se usadas em outros lugares, mantidas aqui para referência)
export interface PaginatedData<T> {
  current_page: number;
  data: T[];
  last_page: number;
  total: number;
  first_page_url: string;
  from: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
}

export interface ResponsaveiPaginateResponse {
  status: boolean;
  message: string;
  responsaveis: PaginatedData<Responsavel>;
}

export interface FullResponsaveisApiResponse {
  status: boolean;
  message: string;
  responsaveis_ativos: PaginatedData<Responsavel>;
  responsaveis_inativos: PaginatedData<Responsavel>;
}