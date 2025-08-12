import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FuncionariosService } from './funcionarios.service';

describe('FuncionariosService', () => {
  let service: FuncionariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Adiciona o HttpClientTestingModule para fornecer o mock do HttpClient
      imports: [HttpClientTestingModule],
      // Fornece o serviço para o TestBed
      providers: [FuncionariosService]
    });
    service = TestBed.inject(FuncionariosService);
  });

  it('should be created', () => {
    // Com o mock do HttpClient, o serviço pode ser criado e o teste passa
    expect(service).toBeTruthy();
  });
});

