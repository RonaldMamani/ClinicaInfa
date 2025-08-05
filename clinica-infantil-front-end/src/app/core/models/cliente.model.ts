import { Cidade } from "./cidades.model";
import { Genero } from "./generos.model";
import { Paciente } from "./paciente.model";
import { Responsavel } from "./responsavel.model";


export interface Cliente {
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
  cidade: Cidade;
  genero: Genero;
  responsavel: Responsavel;
  paciente: Paciente;
}

export interface ApiResponseClientes {
  status: boolean;
  message: string;
  clientes: Cliente[];
}

export interface ClienteDetailsResponse {
  status: boolean;
  message: string;
  cliente: Cliente;
}

export interface UpdateClientePayload {
  id_cidade?: number;
  id_genero?: number;
  cpf?: string;
  rg?: string;
  nome?: string;
  endereco?: string;
  ativo?: number;
}

export interface CreateClientePayload {
  nome: string;
  cpf: string;
  rg?: string;
  endereco: string;
  id_cidade: number;
  id_genero: number;
}

export interface CreatePacientePayload extends CreateClientePayload {
  historico_medico: string;
  data_nascimento: string;
  id_responsavel: number;
}

export interface CreateResponsavelPayload extends CreateClientePayload {
  grau_parentesco: string;
  email: string;
  telefone: string;
}