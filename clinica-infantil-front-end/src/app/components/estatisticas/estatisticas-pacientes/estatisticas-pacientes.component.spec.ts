import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstatisticasPacientesComponent } from './estatisticas-pacientes.component';

describe('EstatisticasPacientesComponent', () => {
  let component: EstatisticasPacientesComponent;
  let fixture: ComponentFixture<EstatisticasPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstatisticasPacientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstatisticasPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
