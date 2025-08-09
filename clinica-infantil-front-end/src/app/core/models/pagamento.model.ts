import { Consulta } from "./consultas.model";
import { PaginatedApiResponse } from "./Paginate.model";

export interface Pagamento {
    id: number;
    id_consulta: number;
    valor: number;
    metodo_pagamento: string;
    data_pagamento: string;
    consulta: Consulta
}

export interface PagamentoResponse {
    status: boolean;
    message: string;
    pagamento: Pagamento;
}

export interface PagamentosPaginateApiResponse {
    status: boolean;
    message: string;
    pagamentos: PaginatedApiResponse<Pagamento[]>;
}