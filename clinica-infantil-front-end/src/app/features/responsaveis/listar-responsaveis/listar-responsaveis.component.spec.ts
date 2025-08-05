import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarResponsaveisComponent } from './listar-responsaveis.component';

describe('ListarResponsaveisComponent', () => {
  let component: ListarResponsaveisComponent;
  let fixture: ComponentFixture<ListarResponsaveisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarResponsaveisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarResponsaveisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
