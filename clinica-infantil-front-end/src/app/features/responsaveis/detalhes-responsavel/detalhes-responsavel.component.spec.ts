import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesResponsavelComponent } from './detalhes-responsavel.component';

describe('DetalhesResponsavelComponent', () => {
  let component: DetalhesResponsavelComponent;
  let fixture: ComponentFixture<DetalhesResponsavelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesResponsavelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesResponsavelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
