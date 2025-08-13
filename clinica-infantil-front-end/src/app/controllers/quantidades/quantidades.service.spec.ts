import { TestBed } from '@angular/core/testing';

import { QuantidadesService } from './quantidades.service';

describe('QuantidadesService', () => {
  let service: QuantidadesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuantidadesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
