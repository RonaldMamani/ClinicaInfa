export interface Estado {
  id: number;
  nome_estado: string;
  sigla: string;
}

// Interface que representa a estrutura completa da resposta da API de estados
export interface ApiResponseEstados {
  status: boolean;
  estados: Estado[];
}