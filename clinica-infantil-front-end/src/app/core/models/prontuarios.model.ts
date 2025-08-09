import { Paciente } from "./paciente.model";
import { PaginatedApiResponse } from "./Paginate.model";

export interface Prontuario {
    id: number;
    id_paciente: number;
    id_medico: number;
    data_diagnostico: string;
    diagnostico: string;
    prescricao: string;
    observacoes: string;
    paciente: Paciente;
}

export interface ProntuarioDetailResponse {
    status: boolean;
    message: string;
    prontuario: Prontuario;
}

export interface ProntuariosPaginateApiResponse {
  status: boolean;
  message: string;
  prontuarios: PaginatedApiResponse<Prontuario[]>;
}