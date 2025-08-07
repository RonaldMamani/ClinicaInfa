import { Paciente } from "./paciente.model";

export interface Prontuario {
    id: number;
    id_paciente: number;
    id_medico: number;
    data_diagnostico: string;
    diagnostico: string;
    prescricao: string;
    observacoes: string;
    pacientes: Paciente;
}

export interface ProntuarioDetailResponse {
    status: boolean;
    message: string;
    prontuario: Prontuario;
}

export interface ProntuariosApiResponse {
  status: boolean;
  message: string;
  prontuarios: PaginatedData<Prontuario>;
}

export interface PaginatedData<Prontuario> {
  current_page: number;
  data: Prontuario[];
  last_page: number;
  total: number;
  first_page_url: string;
  from: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
}