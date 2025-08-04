import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtenderConsultaComponent } from './atender-consulta.component';

describe('AtenderConsultaComponent', () => {
  let component: AtenderConsultaComponent;
  let fixture: ComponentFixture<AtenderConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtenderConsultaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtenderConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
