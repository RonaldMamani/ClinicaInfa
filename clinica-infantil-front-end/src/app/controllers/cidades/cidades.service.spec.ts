import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CidadesService } from './cidades.service';

describe('CidadesService', () => {
  let service: CidadesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Adiciona o HttpClientTestingModule para fornecer o mock do HttpClient
      imports: [HttpClientTestingModule],
      // O serviço a ser testado
      providers: [CidadesService]
    });
    service = TestBed.inject(CidadesService);
  });

  // O teste básico para verificar se o serviço foi criado com sucesso.
  // Isso resolve o erro de injeção.
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Adicione testes aqui para as outras funções do serviço
  // para verificar se elas chamam a API corretamente.
});
