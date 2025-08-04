import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheProntuarioComponent } from './detalhe-prontuario.component';

describe('DetalheProntuarioComponent', () => {
  let component: DetalheProntuarioComponent;
  let fixture: ComponentFixture<DetalheProntuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheProntuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalheProntuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
