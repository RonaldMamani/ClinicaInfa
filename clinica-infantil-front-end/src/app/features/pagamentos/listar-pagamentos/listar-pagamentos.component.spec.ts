import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ListarPagamentosComponent } from './listar-pagamentos.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ListarPagamentosComponent', () => {
  let component: ListarPagamentosComponent;
  let fixture: ComponentFixture<ListarPagamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ListarPagamentosComponent,
        RouterTestingModule, // Adicionado para fornecer os serviços de roteamento
        HttpClientTestingModule // Adicionado para mockar as chamadas HTTP
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListarPagamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
