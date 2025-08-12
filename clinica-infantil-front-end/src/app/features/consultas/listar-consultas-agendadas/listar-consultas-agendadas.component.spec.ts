import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ListarConsultasAgendadasComponent } from './listar-consultas-agendadas.component';
import { RouterTestingModule } from '@angular/router/testing'; // Importe o RouterTestingModule

describe('ListarConsultasAgendadasComponent', () => {
  let component: ListarConsultasAgendadasComponent;
  let fixture: ComponentFixture<ListarConsultasAgendadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarConsultasAgendadasComponent, RouterTestingModule], // Adicione RouterTestingModule aqui
    }).compileComponents();

    fixture = TestBed.createComponent(ListarConsultasAgendadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
