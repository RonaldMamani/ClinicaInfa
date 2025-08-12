import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ListarFuncionariosComponent } from './listar-funcionarios.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ListarFuncionariosComponent', () => {
  let component: ListarFuncionariosComponent;
  let fixture: ComponentFixture<ListarFuncionariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ListarFuncionariosComponent,
        RouterTestingModule, // Adicionado para fornecer os serviços de roteamento
        HttpClientTestingModule, // Adicionado para mockar as chamadas HTTP
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListarFuncionariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
