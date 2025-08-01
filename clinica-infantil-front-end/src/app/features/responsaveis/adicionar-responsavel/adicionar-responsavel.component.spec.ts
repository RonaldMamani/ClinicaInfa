import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionarResponsavelComponent } from './adicionar-responsavel.component';

describe('AdicionarResponsavelComponent', () => {
  let component: AdicionarResponsavelComponent;
  let fixture: ComponentFixture<AdicionarResponsavelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdicionarResponsavelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdicionarResponsavelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
