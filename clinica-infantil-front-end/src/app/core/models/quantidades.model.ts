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

export interface ResponsaveisPorCidadeResponse {
  status: boolean;
  message: string;
  dados: {
    nome_cidade: string;
    total_responsaveis: number;
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

export interface ConsultasPorEspecialidadeResponse {
  status: boolean;
  message: string;
  dados: {
    especialidade: string;
    total_consultas: number;
  }[];
}

export interface PacientesPorGeneroResponse {
  status: boolean;
  message: string;
  dados: {
    genero: string;
    total_pacientes: number;
  }[];
}

export interface ClientesPorFuncaoResponse {
  status: boolean;
  message: string;
  dados: {
    total_clientes: number;
    total_pacientes: number;
    total_responsaveis: number;
  };
}

export interface ConsultasPorMedicoMesResponse {
  status: boolean;
  message: string;
  dados: {
    nome: string;
    mes: string;
    total_consultas: number;
  }[];
}

export interface ConsultasPacienteMensalResponse {
  status: boolean;
  message: string;
  dados: {
    mes: string;
    total_consultas: number;
    total_pacientes_unicos: number;
  }[];
}