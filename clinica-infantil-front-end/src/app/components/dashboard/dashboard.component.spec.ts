import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../controllers/auth/auth.service';

class MockAuthService {
  getUserProfile() {
    // Retorna um Observable com um valor simulado.
    return of('administrador');
  }
  logout() {}
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        // Adiciona o componente standalone
        DashboardComponent,
        // Importa RouterTestingModule para mockar o Router
        RouterTestingModule
      ],
      providers: [
        // Fornece o mock do AuthService no lugar do serviço real
        { provide: AuthService, useClass: MockAuthService },
        // O RouterTestingModule já provê um mock do Router,
        // mas você pode criar um mock se precisar de um comportamento específico
        // como testar o navigate.
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // O único teste que você precisa para que não haja erros.
  // Ele apenas verifica se o componente foi criado com sucesso.
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
