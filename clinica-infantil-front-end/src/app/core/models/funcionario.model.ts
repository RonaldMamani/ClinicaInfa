export interface Funcionario {
  id: number;
  nome: string;
  cpf: string;
  cargo: string;
  email_empresarial: string;
  telefone_empresarial: string;
}

export interface FuncionarioSimples {
  nome: string;
  cpf: string;
  cargo: string;
  email_empresarial: string;
  telefone_empresarial: string;
}

export interface FuncionariosApiResponse {
  status: boolean;
  message: string;
  funcionarios: Funcionario[];
}