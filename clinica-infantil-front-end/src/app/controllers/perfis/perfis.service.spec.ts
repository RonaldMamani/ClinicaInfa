import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PerfisService } from './perfis.service';

describe('PerfisService', () => {
  let service: PerfisService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Adiciona o HttpClientTestingModule para fornecer o mock do HttpClient
      imports: [HttpClientTestingModule],
      // Fornece o serviço para o TestBed
      providers: [PerfisService]
    });
    service = TestBed.inject(PerfisService);
  });

  it('should be created', () => {
    // Com o mock do HttpClient, o serviço agora pode ser criado e o teste passa
    expect(service).toBeTruthy();
  });
});