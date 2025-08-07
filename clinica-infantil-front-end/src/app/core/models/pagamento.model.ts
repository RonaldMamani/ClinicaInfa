import { Consulta } from "./consultas.model";

export interface Pagamento {
    id: number;
    id_consulta: number;
    valor: number;
    metodo_pagamento: string;
    data_pagamento: string;
    consulta: Consulta
}

export interface PaginatedResponse {
    current_page: number;
    data: Pagamento[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: any[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}