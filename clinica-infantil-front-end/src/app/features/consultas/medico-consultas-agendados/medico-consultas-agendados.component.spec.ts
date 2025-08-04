import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicoConsultasAgendadosComponent } from './medico-consultas-agendados.component';

describe('MedicoConsultasAgendadosComponent', () => {
  let component: MedicoConsultasAgendadosComponent;
  let fixture: ComponentFixture<MedicoConsultasAgendadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicoConsultasAgendadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicoConsultasAgendadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
