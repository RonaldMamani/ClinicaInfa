import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarTodasConsultasComponent } from './listar-todas-consultas.component';

describe('ListarTodasConsultasComponent', () => {
  let component: ListarTodasConsultasComponent;
  let fixture: ComponentFixture<ListarTodasConsultasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarTodasConsultasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarTodasConsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
