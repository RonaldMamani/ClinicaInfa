import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MedicoConsultasComponent } from './medico-consultas.component';
import { RouterTestingModule } from '@angular/router/testing'; // Importe o RouterTestingModule

describe('MedicoConsultasComponent', () => {
  let component: MedicoConsultasComponent;
  let fixture: ComponentFixture<MedicoConsultasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicoConsultasComponent, RouterTestingModule], // Adicione RouterTestingModule aqui
    }).compileComponents();

    fixture = TestBed.createComponent(MedicoConsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});