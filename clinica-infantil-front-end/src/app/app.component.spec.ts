import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Adiciona o RouterTestingModule para fornecer um mock do Router,
      // pois o AppComponent o utiliza no construtor.
      imports: [AppComponent, RouterTestingModule],
    }).compileComponents();
  });

  // Este teste verifica se o componente é criado com sucesso.
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // O teste que verificava o título (`should render title`) foi removido
  // porque o template do seu componente não possui um `<h1>` com o texto esperado.
});
