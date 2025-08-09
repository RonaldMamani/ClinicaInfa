import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstatisticasReceitaComponent } from './estatisticas-receita.component';

describe('EstatisticasReceitaComponent', () => {
  let component: EstatisticasReceitaComponent;
  let fixture: ComponentFixture<EstatisticasReceitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstatisticasReceitaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstatisticasReceitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
