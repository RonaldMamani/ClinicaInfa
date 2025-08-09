export interface QuantidadeTotalResponse {
  status: boolean;
  message: string;
  quantidade_total: number;
}

export interface QuantidadeAgendadaResponse {
  status: boolean;
  message: string;
  quantidade: number;
}

export interface PacientesContagemResponse {
  status: boolean;
  message: string;
  dados: {
    ativos: number;
    inativos: number;
  };
}

export interface TodasEstatisticasResponse {
  status: boolean;
  message: string;
  dados: {
    total: number;
    agendadas: number;
    canceladas: number;
    finalizadas: number;
  };
}

export interface PacientesPorCidadeResponse {
  status: boolean;
  message: string;
  dados: {
    nome_cidade: string;
    total_pacientes: number;
  }[];
}

export interface ReceitaMensalResponse {
  status: boolean;
  message: string;
  dados: {
    mes: string;
    total_receita: number;
  }[];
}