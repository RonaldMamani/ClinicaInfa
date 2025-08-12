import { TestBed } from '@angular/core/testing';
import { EstatisticasService } from './estatisticas.service';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importe o módulo de teste

describe('EstatisticasService', () => {
  let service: EstatisticasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule] // Adicione HttpClientTestingModule aqui
    });
    service = TestBed.inject(EstatisticasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});