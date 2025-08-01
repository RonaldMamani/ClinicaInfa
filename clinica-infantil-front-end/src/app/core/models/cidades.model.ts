// Interface para um único objeto Cidade
export interface Cidade {
  id: number;
  id_estado: number;
  nome_cidade: string;
}

// Interface para a resposta completa da API de cidades
export interface ApiResponseCidades {
  status: boolean;
  message: string;
  cidades: Cidade[];
}