import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheFuncionarioComponent } from './detalhe-funcionario.component';

describe('DetalheFuncionarioComponent', () => {
  let component: DetalheFuncionarioComponent;
  let fixture: ComponentFixture<DetalheFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheFuncionarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalheFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
