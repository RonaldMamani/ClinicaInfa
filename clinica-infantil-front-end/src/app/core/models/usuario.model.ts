import { Funcionario } from "./funcionario.model";
import { Perfil } from "./perfil.model";

export interface Usuario {
  id: number;
  id_perfil: number;
  id_funcionario: number;
  username: string;
  ativo: number;
  perfil: Perfil;
  funcionario: Funcionario;
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