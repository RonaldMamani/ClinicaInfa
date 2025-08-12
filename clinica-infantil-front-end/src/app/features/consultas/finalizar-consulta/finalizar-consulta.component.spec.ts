import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FinalizarConsultaComponent } from './finalizar-consulta.component';
import { RouterTestingModule } from '@angular/router/testing'; // Importe o RouterTestingModule

describe('FinalizarConsultaComponent', () => {
  let component: FinalizarConsultaComponent;
  let fixture: ComponentFixture<FinalizarConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalizarConsultaComponent, RouterTestingModule], // Adicione RouterTestingModule aqui
    }).compileComponents();

    fixture = TestBed.createComponent(FinalizarConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
