import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GenerosService } from './generos.service';

describe('GenerosService', () => {
  let service: GenerosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Adiciona o HttpClientTestingModule para fornecer o mock do HttpClient
      imports: [HttpClientTestingModule],
      // Fornece o serviço para o TestBed
      providers: [GenerosService]
    });
    service = TestBed.inject(GenerosService);
  });

  it('should be created', () => {
    // O teste agora passará, pois o HttpClient está disponível (mockado)
    expect(service).toBeTruthy();
  });
});
