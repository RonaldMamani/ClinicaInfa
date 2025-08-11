import { Funcionario } from "./funcionario.model";
import { Medico } from "./medico.model";
import { Perfil } from "./perfil.model";

export interface Usuario {
  id: number;
  id_perfil: number;
  id_funcionario: number;
  username: string;
  ativo: number;
  perfil: Perfil;
  funcionario: Funcionario;
  medico: Medico;
}

export interface UsuarioResponse {
  status: boolean;
  message: string;
  usuario?: Usuario;
  error_details?: string;
}

// Interface para a resposta de login
export interface LoginResponse {
  status: boolean;
  message: string;
  access_token: string;
  token_type: string;
  usuario: Usuario;
}

// Interface para a resposta de /api/usuarios/{id}
export interface UsuarioDetailsResponse {
  status: boolean;
  message: string;
  usuario: Usuario;
}

// Interface para a resposta de /api/usuarios (todos os usuários)
export interface UsuariosListResponse {
  status: boolean;
  message: string;
  usuarios: Usuario[];
}

export interface AllUsuariosApiResponse {
  status: boolean;
  message: string;
  usuarios_ativos: Usuario[];
  usuarios_inativos: Usuario[];
}

export interface CreateUsuarioPayload {
  username: string;
  senha: string;
  id_perfil: number;
  ativo: boolean;
  funcionario: {
    nome: string;
    cpf: string;
    cargo: string;
    email_empresarial: string;
    telefone_empresarial: string;
  };
  medico?: {
    CRM: string;
    especialidade: string;
  };
}

export interface UpdateUsuarioPayload {
  username: string;
  id_perfil: number;
  id_funcionario: number;
  ativo: boolean;
  funcionario?: {
    nome: string;
    cpf: string;
    cargo: string;
    email_empresarial: string;
    telefone_empresarial: string;
  };
  medico?: {
    CRM: string;
    especialidade: string;
  };
}