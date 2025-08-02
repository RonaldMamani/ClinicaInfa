export interface QuantidadeTotalResponse {
  status: boolean;
  message: string;
  quantidade_total: number;
}

export interface QuantidadeAgendadaResponse {
  status: boolean;
  message: string;
  quantidade_agendadas: number;
}

export interface PacientesContagemResponse {
  status: boolean;
  message: string;
  dados: {
    ativos: number;
    inativos: number;
  };
}