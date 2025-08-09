export interface PaginatedLink {
  url: string | null;
  label: string;
  active: boolean;
}

// Interface genérica para a resposta paginada
export interface PaginatedApiResponse<T> {
  current_page: number;
  data: T; // 'T' será Prontuario[] neste caso
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginatedLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}