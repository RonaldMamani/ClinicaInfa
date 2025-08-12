import { TestBed, ComponentFixture } from '@angular/core/testing';
import { EditarResponsavelComponent } from './editar-responsavel.component';
import { RouterTestingModule } from '@angular/router/testing'; // Importe o RouterTestingModule

describe('EditarResponsavelComponent', () => {
  let component: EditarResponsavelComponent;
  let fixture: ComponentFixture<EditarResponsavelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarResponsavelComponent, RouterTestingModule], // Adicione RouterTestingModule aqui
    }).compileComponents();

    fixture = TestBed.createComponent(EditarResponsavelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});