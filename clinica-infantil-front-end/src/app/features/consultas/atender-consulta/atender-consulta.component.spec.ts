import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AtenderConsultaComponent } from './atender-consulta.component';
import { RouterTestingModule } from '@angular/router/testing'; // Importe o RouterTestingModule

describe('AtenderConsultaComponent', () => {
  let component: AtenderConsultaComponent;
  let fixture: ComponentFixture<AtenderConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtenderConsultaComponent, RouterTestingModule], // Adicione RouterTestingModule aqui
    }).compileComponents();

    fixture = TestBed.createComponent(AtenderConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
