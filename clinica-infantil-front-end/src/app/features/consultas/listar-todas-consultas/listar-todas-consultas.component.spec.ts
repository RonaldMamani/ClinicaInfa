import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ListarTodasConsultasComponent } from './listar-todas-consultas.component';
import { RouterTestingModule } from '@angular/router/testing'; // Importe o RouterTestingModule

describe('ListarTodasConsultasComponent', () => {
  let component: ListarTodasConsultasComponent;
  let fixture: ComponentFixture<ListarTodasConsultasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarTodasConsultasComponent, RouterTestingModule], // Adicione RouterTestingModule aqui
    }).compileComponents();

    fixture = TestBed.createComponent(ListarTodasConsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});