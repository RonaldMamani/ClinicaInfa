import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionarPacienteComponent } from './adicionar-paciente.component';

describe('AdicionarPacienteComponent', () => {
  let component: AdicionarPacienteComponent;
  let fixture: ComponentFixture<AdicionarPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdicionarPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdicionarPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
