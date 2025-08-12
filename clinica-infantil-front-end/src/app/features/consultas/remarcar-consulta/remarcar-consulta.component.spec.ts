import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RemarcarConsultaComponent } from './remarcar-consulta.component';
import { RouterTestingModule } from '@angular/router/testing'; // Importe o RouterTestingModule

describe('RemarcarConsultaComponent', () => {
  let component: RemarcarConsultaComponent;
  let fixture: ComponentFixture<RemarcarConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemarcarConsultaComponent, RouterTestingModule], // Adicione RouterTestingModule aqui
    }).compileComponents();

    fixture = TestBed.createComponent(RemarcarConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});