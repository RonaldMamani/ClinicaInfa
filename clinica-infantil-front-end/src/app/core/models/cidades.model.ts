import { Estado } from "./estados.model";

export interface Cidade {
  id: number;
  id_estado: number;
  nome_cidade: string;
  estado: Estado;
}

export interface ApiResponseCidades {
  status: boolean;
  message: string;
  cidades: Cidade[];
}
