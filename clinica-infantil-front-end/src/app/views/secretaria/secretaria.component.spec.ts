import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecretariaComponent } from './secretaria.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('SecretariaComponent', () => {
  let component: SecretariaComponent;
  let fixture: ComponentFixture<SecretariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Adiciona o componente standalone
      imports: [
        SecretariaComponent,
        // Mocka o HttpClient para as dependências do AuthService
        HttpClientTestingModule,
        // Mocka o Router para as dependências do AuthService e RouterOutlet
        RouterTestingModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecretariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Com as dependências do HttpClient e Router fornecidas, o componente
    // e suas dependências importadas podem ser criados com sucesso.
    expect(component).toBeTruthy();
  });
});
