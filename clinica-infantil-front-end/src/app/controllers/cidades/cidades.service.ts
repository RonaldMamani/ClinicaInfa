import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cidade } from '../../core/models/cliente.model';
import { ApiResponseCidades } from '../../core/models/cidades.model';

@Injectable({
  providedIn: 'root'
})
export class CidadesService {
  private readonly API_BASE_URL = 'http://localhost:8000/api/estados';

  constructor(private http: HttpClient) { }

  getCidadesPorEstado(idEstado: number): Observable<Cidade[]> {
    const url = `${this.API_BASE_URL}/${idEstado}/cidades`;
    
    return this.http.get<ApiResponseCidades>(url).pipe(
      map(response => response.cidades)
    );
  }
}