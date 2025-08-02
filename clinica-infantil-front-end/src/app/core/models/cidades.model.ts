export interface Cidade {
  id: number;
  id_estado: number;
  nome_cidade: string;
}

export interface ApiResponseCidades {
  status: boolean;
  message: string;
  cidades: Cidade[];
}