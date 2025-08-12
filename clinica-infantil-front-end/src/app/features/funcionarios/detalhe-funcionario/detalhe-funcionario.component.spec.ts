import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DetalheFuncionarioComponent } from './detalhe-funcionario.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('DetalheFuncionarioComponent', () => {
  let component: DetalheFuncionarioComponent;
  let fixture: ComponentFixture<DetalheFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheFuncionarioComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalheFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});