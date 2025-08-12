import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AdicionarFuncionarioComponent } from './adicionar-funcionario.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdicionarFuncionarioComponent', () => {
  let component: AdicionarFuncionarioComponent;
  let fixture: ComponentFixture<AdicionarFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdicionarFuncionarioComponent,
        ReactiveFormsModule,
        RouterTestingModule, // Adicionado para fornecer o ActivatedRoute
        HttpClientTestingModule, // Adicionado para mockar o HttpClient
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdicionarFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});