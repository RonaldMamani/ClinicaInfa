import { Paciente } from './paciente.model';
import { Medico } from './medico.model';

export interface Consulta {
  id: number;
  id_paciente: number;
  id_medico: number;
  data_consulta: string;
  hora_inicio: string;
  hora_fim: string;
  descricao: string;
  status: string;
  paciente: Paciente;
  medico?: Medico;
}

export interface ConsultasApiResponse {
  status: boolean;
  message: string;
  consultas: Consulta[];
}

export interface ConsultasAgendadasApiResponse {
  status: boolean;
  message: string;
  consultas: Consulta[];
}

export interface ConsultaDetailsResponse {
  status: boolean;
  message: string;
  consulta: Consulta;
}