import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DetalhePacienteComponent } from './detalhe-paciente.component';
import { RouterTestingModule } from '@angular/router/testing'; // Importe o RouterTestingModule

describe('DetalhePacienteComponent', () => {
  let component: DetalhePacienteComponent;
  let fixture: ComponentFixture<DetalhePacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhePacienteComponent, RouterTestingModule], // Adicione RouterTestingModule aqui
    }).compileComponents();

    fixture = TestBed.createComponent(DetalhePacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});