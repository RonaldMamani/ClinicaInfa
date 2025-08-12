import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UsuariosService } from './usuarios.service';

describe('UsuariosService', () => {
  let service: UsuariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Adiciona o HttpClientTestingModule para resolver o erro de injeção
      imports: [HttpClientTestingModule],
      // Fornece o serviço para o TestBed
      providers: [UsuariosService]
    });
    service = TestBed.inject(UsuariosService);
  });

  it('should be created', () => {
    // Agora o teste irá passar, pois o HttpClient está disponível (mockado)
    expect(service).toBeTruthy();
  });
});
