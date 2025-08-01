// Interface para o objeto 'cliente' aninhado dentro de 'paciente'
export interface ClienteInfo {
  id: number;
  id_cidade: number;
  id_genero: number;
  cpf: string;
  rg: string;
  nome: string;
  endereco: string;
  ativo: number;
  criado_em: string;
  atualizado_em: string;
}

// Interface para o objeto 'responsavel' aninhado dentro de 'paciente'
// AGORA COM O CLIENTE ANINHADO INCLUÍDO
export interface ResponsavelInfo {
  id: number;
  id_cliente: number;
  grau_parentesco: string;
  email: string;
  telefone: string;
  cliente?: ClienteInfo; // <-- PROPRIEDADE CORRIGIDA E ADICIONADA AQUI
}

// Interface principal para um item da lista de pacientes
export interface Paciente {
  id: number;
  id_cliente: number;
  id_responsavel: number;
  data_nascimento: string;
  historico_medico: string;
  cliente: ClienteInfo;
  responsavel: ResponsavelInfo;
}

// Interface para a resposta completa da API de listagem de pacientes
export interface ApiResponsePacientes {
  status: boolean;
  message: string;
  pacientes: Paciente[];
}

// Interface para a resposta da API ao obter UM paciente por ID
export interface PacienteDetailsResponse {
  status: boolean;
  message: string;
  paciente: Paciente;
}

// Interface para os dados enviados na requisição PUT/POST de um paciente
export interface UpdatePacientePayload {
  id_cliente?: number;
  id_responsavel?: number;
  data_nascimento?: string;
  historico_medico?: string;
}