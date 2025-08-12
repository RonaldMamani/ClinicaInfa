import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalhesConsultaAgendadaComponent } from './detalhes-consulta-agendada.component';
import { RouterTestingModule } from '@angular/router/testing'; // Importe o RouterTestingModule

describe('DetalhesConsultaAgendadaComponent', () => {
  let component: DetalhesConsultaAgendadaComponent;
  let fixture: ComponentFixture<DetalhesConsultaAgendadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesConsultaAgendadaComponent, RouterTestingModule], // Adicione RouterTestingModule aqui
    }).compileComponents();

    fixture = TestBed.createComponent(DetalhesConsultaAgendadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
