import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DetalhesResponsavelComponent } from './detalhes-responsavel.component';
import { RouterTestingModule } from '@angular/router/testing'; // Importe o RouterTestingModule

describe('DetalhesResponsavelComponent', () => {
  let component: DetalhesResponsavelComponent;
  let fixture: ComponentFixture<DetalhesResponsavelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesResponsavelComponent, RouterTestingModule], // Adicione RouterTestingModule aqui
    }).compileComponents();

    fixture = TestBed.createComponent(DetalhesResponsavelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
