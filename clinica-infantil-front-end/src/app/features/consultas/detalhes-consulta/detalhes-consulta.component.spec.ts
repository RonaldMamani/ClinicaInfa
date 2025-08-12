import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DetalhesConsultaComponent } from './detalhes-consulta.component';
import { RouterTestingModule } from '@angular/router/testing'; // Importe o RouterTestingModule

describe('DetalhesConsultaComponent', () => {
  let component: DetalhesConsultaComponent;
  let fixture: ComponentFixture<DetalhesConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesConsultaComponent, RouterTestingModule], // Adicione RouterTestingModule aqui
    }).compileComponents();

    fixture = TestBed.createComponent(DetalhesConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});