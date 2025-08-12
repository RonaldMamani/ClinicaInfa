import { TestBed } from '@angular/core/testing';

import { EstadosService } from './estados.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EstadosService', () => {
  let service: EstadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Importa o HttpClientTestingModule para fornecer o mock do HttpClient
      imports: [HttpClientTestingModule],
      // O serviço a ser testado
      providers: [EstadosService]
    });
    service = TestBed.inject(EstadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Você pode adicionar mais testes aqui para as funções do serviço,
  // como getEstados(), simulando as respostas da API.
});
