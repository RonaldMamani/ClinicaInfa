import { Consulta } from "./consultas.model";
import { Usuario } from "./usuario.model";


export interface Medico {
  id: number;
  id_usuario: number;
  CRM: string;
  especialidade: string;
  created_at: string;
  updated_at: string;
  usuario: Usuario;
  consultas: Consulta[]
}

export interface MedicosApiResponse {
  status: boolean;
  message: string;
  medicos: Medico[];
}