import { TestBed, ComponentFixture } from '@angular/core/testing';
import { EditarPacienteComponent } from './editar-paciente.component';
import { RouterTestingModule } from '@angular/router/testing'; // Importe o RouterTestingModule

describe('EditarPacienteComponent', () => {
  let component: EditarPacienteComponent;
  let fixture: ComponentFixture<EditarPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPacienteComponent, RouterTestingModule], // Adicione RouterTestingModule aqui
    }).compileComponents();

    fixture = TestBed.createComponent(EditarPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});