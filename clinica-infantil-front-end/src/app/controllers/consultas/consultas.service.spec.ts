import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ConsultasService } from './consultas.service';

describe('ConsultasService', () => {
  let service: ConsultasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Adiciona o HttpClientTestingModule para fornecer o mock do HttpClient
      imports: [HttpClientTestingModule],
      // Fornece o serviço que estamos testando
      providers: [ConsultasService]
    });
    service = TestBed.inject(ConsultasService);
  });

  it('should be created', () => {
    // Com o HttpClientTestingModule, o teste de criação do serviço agora passará
    expect(service).toBeTruthy();
  });
});