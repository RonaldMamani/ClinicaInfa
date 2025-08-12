import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ClientesService } from './clientes.service';

describe('ClientesService', () => {
  let service: ClientesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Adiciona o HttpClientTestingModule para fornecer um mock do HttpClient
      imports: [HttpClientTestingModule],
      // Fornece o serviço para o TestBed
      providers: [ClientesService]
    });
    service = TestBed.inject(ClientesService);
  });

  it('should be created', () => {
    // Com o HttpClient mockado, a injeção de dependência funciona e o serviço é criado.
    expect(service).toBeTruthy();
  });
});