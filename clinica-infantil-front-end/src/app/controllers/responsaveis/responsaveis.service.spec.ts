import { TestBed } from '@angular/core/testing';

import { ResponsaveisService } from './responsaveis.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ResponsaveisService', () => {
  let service: ResponsaveisService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Importa HttpClientTestingModule para fornecer um mock do HttpClient
      imports: [HttpClientTestingModule],
      // O serviço a ser testado
      providers: [ResponsaveisService]
    });
    service = TestBed.inject(ResponsaveisService);
  });

  // O teste básico para verificar se o serviço foi criado com sucesso.
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Você pode adicionar mais testes aqui para as outras funções do serviço
  // Por exemplo:
  // it('should return paginated responsaveis', () => {
  //   // Exemplo de como testar a função getResponsaveisPaginados
  // });
});
