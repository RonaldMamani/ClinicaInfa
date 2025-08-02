// Interface para o perfil (como retornado dentro de 'usuario')
export interface Perfil {
  id: number;
  nome_perfil: string;
  descricao: string;
}

export interface Funcionario {
  id: number;
  nome: string;
  cpf: string;
  cargo: string;
  email_empresarial: string;
  telefone_empresarial: string;
}

export interface Usuario {
  id: number;
  id_perfil: number;
  id_funcionario: number;
  username: string;
  ativo: number;
  perfil?: Perfil; // Opcional, pois pode não vir na resposta de login inicial
  funcionario?: Funcionario; // Opcional, pois pode não vir na resposta de login inicial
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