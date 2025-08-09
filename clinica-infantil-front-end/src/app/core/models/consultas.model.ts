import { Paciente } from './paciente.model';
import { Medico } from './medico.model';
import { Pagamento } from './pagamento.model';
import { PaginatedApiResponse } from './Paginate.model';

export interface Consulta {
  id: number;
  id_paciente: number;
  id_medico: number;
  data_consulta: string;
  hora_inicio: string;
  hora_fim: string;
  status: string;
  descricao: string;
  paciente: Paciente;
  medico: Medico;
  pagamento: Pagamento;
}

export interface Pagination {
  current_page: number;
  data: Consulta[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ConsultasPaginationApiResponse {
  status: boolean;
  message: string;
  consultas: PaginatedApiResponse<Consulta[]>;
}

export interface ConsultasApiResponse {
  status: boolean;
  message: string;
  consultas: Consulta[];
}

export interface ConsultaDetailsResponse {
  status: boolean;
  message: string;
  consulta: Consulta;
}

export interface UpdateConsultaResponse {
  status: boolean;
  message: string;
  consulta: Consulta;
}

export interface FinalizarConsultaPayload {
  valor: number;
  metodo_pagamento: string;
  data_pagamento: string;
}