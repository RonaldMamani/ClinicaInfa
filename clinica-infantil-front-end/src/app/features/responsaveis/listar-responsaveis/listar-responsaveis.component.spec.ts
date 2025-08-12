import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ListarResponsaveisComponent } from './listar-responsaveis.component';
import { RouterTestingModule } from '@angular/router/testing'; // Importe o RouterTestingModule

describe('ListarResponsaveisComponent', () => {
  let component: ListarResponsaveisComponent;
  let fixture: ComponentFixture<ListarResponsaveisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarResponsaveisComponent, RouterTestingModule], // Adicione RouterTestingModule aqui
    }).compileComponents();

    fixture = TestBed.createComponent(ListarResponsaveisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});