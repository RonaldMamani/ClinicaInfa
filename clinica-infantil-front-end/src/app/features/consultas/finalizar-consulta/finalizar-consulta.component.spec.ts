import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizarConsultaComponent } from './finalizar-consulta.component';

describe('FinalizarConsultaComponent', () => {
  let component: FinalizarConsultaComponent;
  let fixture: ComponentFixture<FinalizarConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalizarConsultaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalizarConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
