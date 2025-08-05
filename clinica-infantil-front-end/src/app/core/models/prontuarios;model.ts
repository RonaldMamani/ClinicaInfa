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