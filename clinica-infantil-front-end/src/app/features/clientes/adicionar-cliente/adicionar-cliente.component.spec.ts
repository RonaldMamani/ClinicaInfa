import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AdicionarClienteComponent } from './adicionar-cliente.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdicionarClienteComponent', () => {
  let component: AdicionarClienteComponent;
  let fixture: ComponentFixture<AdicionarClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdicionarClienteComponent,
        RouterTestingModule, // Adicionado para fornecer o ActivatedRoute
        HttpClientTestingModule, // Adicionado para mockar o HttpClient
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdicionarClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
