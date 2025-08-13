import { Consulta } from "./consultas.model";
import { Usuario } from "./usuario.model";


export interface Medico {
  id: number;
  id_usuario: number;
  CRM: string;
  especialidade: string;
  usuario: Usuario;
  consultas: Consulta[]
}

export interface MedicoSimples {
  CRM: string;
  especialidade: string;
}

export interface MedicosApiResponse {
  status: boolean;
  message: string;
  medicos: Medico[];
}