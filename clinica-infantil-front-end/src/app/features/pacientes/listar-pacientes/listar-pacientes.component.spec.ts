import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ListarPacientesComponent } from './listar-pacientes.component';
import { RouterTestingModule } from '@angular/router/testing'; // Importe o RouterTestingModule

describe('ListarPacientesComponent', () => {
  let component: ListarPacientesComponent;
  let fixture: ComponentFixture<ListarPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarPacientesComponent, RouterTestingModule], // Adicione RouterTestingModule aqui
    }).compileComponents();

    fixture = TestBed.createComponent(ListarPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});