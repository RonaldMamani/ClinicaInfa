import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstatisticasResponsaveisComponent } from './estatisticas-responsaveis.component';

describe('EstatisticasResponsaveisComponent', () => {
  let component: EstatisticasResponsaveisComponent;
  let fixture: ComponentFixture<EstatisticasResponsaveisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstatisticasResponsaveisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstatisticasResponsaveisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
