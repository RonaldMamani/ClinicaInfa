// A interface 'Cliente' precisa ser importada para o 'ResponsavelComCliente'
import { Cliente } from './cliente.model';

// Representa a estrutura de um responsável com os campos específicos
export interface Responsavel {
  id: number;
  id_cliente: number; // Propriedade adicionada
  grau_parentesco: string;
  email: string;
  telefone: string;
}

// Representa o objeto do responsável completo, com os dados do cliente aninhados
// Isso corresponde ao objeto retornado pela sua API
export interface ResponsavelComCliente extends Responsavel {
  cliente: Cliente;
}

// Representa a resposta completa da API que retorna uma lista de responsáveis
export interface ResponsaveisApiResponse {
  status: boolean;
  message: string;
  responsaveis: ResponsavelComCliente[];
}

// Representa a resposta completa da API para um único responsável
export interface ResponsavelDetailsResponse {
  status: boolean;
  message: string;
  responsavel: ResponsavelComCliente;
}

// Payloads para PUT/POST (opcionais, mas úteis para tipagem)
export interface UpdateResponsavelPayload {
  grau_parentesco?: string;
  email?: string;
  telefone?: string;
}