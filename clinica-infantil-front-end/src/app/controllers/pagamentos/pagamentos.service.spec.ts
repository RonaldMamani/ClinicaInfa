import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PagamentosService } from './pagamentos.service';

describe('PagamentosService', () => {
  let service: PagamentosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Adiciona o HttpClientTestingModule para simular o HttpClient
      imports: [HttpClientTestingModule],
      // Fornece o serviço para o ambiente de testes
      providers: [PagamentosService]
    });
    service = TestBed.inject(PagamentosService);
  });

  it('should be created', () => {
    // Agora o teste irá passar, pois o HttpClient está disponível (mockado)
    expect(service).toBeTruthy();
  });
});