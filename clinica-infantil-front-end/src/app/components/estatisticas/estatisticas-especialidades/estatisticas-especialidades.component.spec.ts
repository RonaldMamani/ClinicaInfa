import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstatisticasEspecialidadesComponent } from './estatisticas-especialidades.component';

describe('EstatisticasEspecialidadesComponent', () => {
  let component: EstatisticasEspecialidadesComponent;
  let fixture: ComponentFixture<EstatisticasEspecialidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstatisticasEspecialidadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstatisticasEspecialidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
