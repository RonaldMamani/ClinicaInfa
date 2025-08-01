export interface Genero {
    id: number;
    genero: string;
}

export interface GeneroApiResponse {
    status: boolean;
    generos: Genero[];
}