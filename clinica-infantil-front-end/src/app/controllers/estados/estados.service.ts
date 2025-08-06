import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseEstados, Estado } from '../../core/models/estados.model';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {
  private readonly API_URL = 'http://localhost:8000/api/estados';

  constructor(private http: HttpClient) { }

  getEstados(): Observable<Estado[]> {
    return this.http.get<ApiResponseEstados>(this.API_URL).pipe(
      map(response => response.estados)
    );
  }
}