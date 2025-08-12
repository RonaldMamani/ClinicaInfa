import { TestBed, ComponentFixture } from '@angular/core/testing';
import { EditarFuncionarioComponent } from './editar-funcionario.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EditarFuncionarioComponent', () => {
  let component: EditarFuncionarioComponent;
  let fixture: ComponentFixture<EditarFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EditarFuncionarioComponent,
        ReactiveFormsModule,
        RouterTestingModule, // Adicione RouterTestingModule aqui
        HttpClientTestingModule, // Adicione HttpClientTestingModule aqui
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});