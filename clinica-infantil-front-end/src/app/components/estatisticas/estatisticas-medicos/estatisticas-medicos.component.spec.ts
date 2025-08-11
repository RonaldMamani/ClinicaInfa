import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstatisticasMedicosComponent } from './estatisticas-medicos.component';

describe('EstatisticasMedicosComponent', () => {
  let component: EstatisticasMedicosComponent;
  let fixture: ComponentFixture<EstatisticasMedicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstatisticasMedicosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstatisticasMedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
