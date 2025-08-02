import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesConsultaAgendadaComponent } from './detalhes-consulta-agendada.component';

describe('DetalhesConsultaAgendadaComponent', () => {
  let component: DetalhesConsultaAgendadaComponent;
  let fixture: ComponentFixture<DetalhesConsultaAgendadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesConsultaAgendadaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesConsultaAgendadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
