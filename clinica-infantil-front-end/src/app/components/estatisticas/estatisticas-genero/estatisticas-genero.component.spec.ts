import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstatisticasGeneroComponent } from './estatisticas-genero.component';

describe('EstatisticasGeneroComponent', () => {
  let component: EstatisticasGeneroComponent;
  let fixture: ComponentFixture<EstatisticasGeneroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstatisticasGeneroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstatisticasGeneroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
