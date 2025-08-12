import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ListarProntuariosComponent } from './listar-prontuarios.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ListarProntuariosComponent', () => {
  let component: ListarProntuariosComponent;
  let fixture: ComponentFixture<ListarProntuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ListarProntuariosComponent,
        RouterTestingModule, // Adicionado para fornecer o ActivatedRoute
        HttpClientTestingModule, // Adicionado para mockar o HttpClient
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListarProntuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
