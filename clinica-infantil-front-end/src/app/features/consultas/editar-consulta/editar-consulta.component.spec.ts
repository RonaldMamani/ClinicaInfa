import { TestBed, ComponentFixture } from '@angular/core/testing';
import { EditarConsultaComponent } from './editar-consulta.component';
import { RouterTestingModule } from '@angular/router/testing'; // Importe o RouterTestingModule

describe('EditarConsultaComponent', () => {
  let component: EditarConsultaComponent;
  let fixture: ComponentFixture<EditarConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarConsultaComponent, RouterTestingModule], // Adicione RouterTestingModule aqui
    }).compileComponents();

    fixture = TestBed.createComponent(EditarConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});