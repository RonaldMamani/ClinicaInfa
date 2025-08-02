export interface Estado {
  id: number;
  nome_estado: string;
  sigla: string;
}

export interface ApiResponseEstados {
  status: boolean;
  estados: Estado[];
}