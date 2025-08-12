import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstatisticasComponent } from './estatisticas.component';
import { RouterTestingModule } from '@angular/router/testing'; // Importe o RouterTestingModule

describe('EstatisticasComponent', () => {
  let component: EstatisticasComponent;
  let fixture: ComponentFixture<EstatisticasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstatisticasComponent, RouterTestingModule], // Adicione RouterTestingModule aqui
    }).compileComponents();

    fixture = TestBed.createComponent(EstatisticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});