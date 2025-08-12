import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ProntuariosService } from './prontuarios.service';

describe('ProntuariosService', () => {
  let service: ProntuariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Adiciona o HttpClientTestingModule para mockar o HttpClient
      imports: [HttpClientTestingModule],
      // Fornece o serviço para o TestBed
      providers: [ProntuariosService]
    });
    service = TestBed.inject(ProntuariosService);
  });

  it('should be created', () => {
    // Agora que o HttpClient está mockado, o serviço pode ser criado com sucesso
    expect(service).toBeTruthy();
  });
});
