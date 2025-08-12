import { TestBed, ComponentFixture } from '@angular/core/testing';
import { EditarPagamentoComponent } from './editar-pagamento.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EditarPagamentoComponent', () => {
  let component: EditarPagamentoComponent;
  let fixture: ComponentFixture<EditarPagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EditarPagamentoComponent,
        RouterTestingModule, // Importado para fornecer o ActivatedRoute
        HttpClientTestingModule, // Importado para mockar o HttpClient
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
