import { TestBed } from '@angular/core/testing';

import { MedicosService } from './medicos.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MedicosService', () => {
  let service: MedicosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Adiciona o HttpClientTestingModule para fornecer um mock do HttpClient
      imports: [HttpClientTestingModule],
      // O serviço a ser testado
      providers: [MedicosService]
    });
    service = TestBed.inject(MedicosService);
  });

  // O teste básico para verificar se o serviço foi criado com sucesso.
  // Isso resolve o erro de injeção.
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Adicione testes aqui para as outras funções do serviço
  // para verificar se elas chamam a API corretamente.
});
