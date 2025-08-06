import { Paciente } from "./paciente.model";
import { PaginatedData } from "./responsavel.model";

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