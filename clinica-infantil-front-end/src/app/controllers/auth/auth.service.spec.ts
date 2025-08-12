import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;
  let routerMock = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Adiciona o HttpClientTestingModule para mockar o HttpClient
      imports: [HttpClientTestingModule],
      providers: [
        // Fornece o serviço para o TestBed
        AuthService,
        // Fornece um mock para o Router, já que o serviço o utiliza
        { provide: Router, useValue: routerMock }
      ]
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Verifica se não há requisições pendentes
  });

  it('should be created', () => {
    // Com o HttpClient mockado e o Router fornecido, o serviço é criado.
    expect(service).toBeTruthy();
  });

});