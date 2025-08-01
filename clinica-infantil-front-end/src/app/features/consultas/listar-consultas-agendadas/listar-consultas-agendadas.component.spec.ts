import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarConsultasAgendadasComponent } from './listar-consultas-agendadas.component';

describe('ListarConsultasAgendadasComponent', () => {
  let component: ListarConsultasAgendadasComponent;
  let fixture: ComponentFixture<ListarConsultasAgendadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarConsultasAgendadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarConsultasAgendadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
