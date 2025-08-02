import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarcarConsultaComponent } from './remarcar-consulta.component';

describe('RemarcarConsultaComponent', () => {
  let component: RemarcarConsultaComponent;
  let fixture: ComponentFixture<RemarcarConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemarcarConsultaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemarcarConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
