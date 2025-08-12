import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PacientesService } from './pacientes.service';

describe('PacientesService', () => {
  let service: PacientesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Adiciona o HttpClientTestingModule para fornecer o mock do HttpClient
      imports: [HttpClientTestingModule],
      // Fornece o serviço para o TestBed
      providers: [PacientesService]
    });
    service = TestBed.inject(PacientesService);
  });

  it('should be created', () => {
    // Com o mock do HttpClient, o serviço agora pode ser criado
    expect(service).toBeTruthy();
  });
});
