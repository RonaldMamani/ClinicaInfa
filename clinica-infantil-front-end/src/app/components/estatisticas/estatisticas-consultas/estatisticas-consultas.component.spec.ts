import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstatisticasConsultasComponent } from './estatisticas-consultas.component';

describe('EstatisticasConsultasComponent', () => {
  let component: EstatisticasConsultasComponent;
  let fixture: ComponentFixture<EstatisticasConsultasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstatisticasConsultasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstatisticasConsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
