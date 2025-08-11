import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstatisticasPacienteConsultasComponent } from './estatisticas-paciente-consultas.component';

describe('EstatisticasPacienteConsultasComponent', () => {
  let component: EstatisticasPacienteConsultasComponent;
  let fixture: ComponentFixture<EstatisticasPacienteConsultasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstatisticasPacienteConsultasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstatisticasPacienteConsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
