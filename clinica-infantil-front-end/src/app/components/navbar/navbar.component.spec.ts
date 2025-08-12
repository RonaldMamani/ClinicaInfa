import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../controllers/auth/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    // Cria um objeto espião para o AuthService
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      userProfile$: of('secretaria'), // Mocka o Observable userProfile$
      userName$: of('Jane') // Mocka o Observable userName$
    });

    await TestBed.configureTestingModule({
      // Como é um componente standalone, o import é direto.
      // É crucial importar o HttpClientTestingModule e o RouterTestingModule
      imports: [NavbarComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        // Fornece o espião para o AuthService em vez do serviço real
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Com todos os serviços mockados/mockados, o componente pode ser criado sem erros.
    expect(component).toBeTruthy();
  });
});