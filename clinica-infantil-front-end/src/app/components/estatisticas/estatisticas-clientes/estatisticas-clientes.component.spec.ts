import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstatisticasClientesComponent } from './estatisticas-clientes.component';

describe('EstatisticasClientesComponent', () => {
  let component: EstatisticasClientesComponent;
  let fixture: ComponentFixture<EstatisticasClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstatisticasClientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstatisticasClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
