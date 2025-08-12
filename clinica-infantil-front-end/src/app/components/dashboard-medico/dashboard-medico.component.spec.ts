import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardMedicoComponent } from './dashboard-medico.component';
import { MedicosService } from '../../controllers/medicos/medicos.service';
import { ProntuariosService } from '../../controllers/prontuarios/prontuarios.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('DashboardMedicoComponent', () => {
  let component: DashboardMedicoComponent;
  let fixture: ComponentFixture<DashboardMedicoComponent>;
  let medicosServiceSpy: jasmine.SpyObj<MedicosService>;
  let prontuarioServiceSpy: jasmine.SpyObj<ProntuariosService>;

  beforeEach(async () => {
    // Cria objetos espiões (spies) para os serviços
    medicosServiceSpy = jasmine.createSpyObj('MedicosService', ['getTotalConsultasCount', 'getProximasConsultasCount']);
    prontuarioServiceSpy = jasmine.createSpyObj('ProntuariosService', ['someMethod']); // Crie um spy para o ProntuariosService também

    await TestBed.configureTestingModule({
      // Adiciona o componente standalone e os módulos de teste nos imports
      imports: [DashboardMedicoComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        // Fornece os espiões em vez dos serviços reais
        { provide: MedicosService, useValue: medicosServiceSpy },
        { provide: ProntuariosService, useValue: prontuarioServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    // Configura os espiões para retornar Observables de sucesso
    medicosServiceSpy.getTotalConsultasCount.and.returnValue(of(10));
    medicosServiceSpy.getProximasConsultasCount.and.returnValue(of(3));

    fixture = TestBed.createComponent(DashboardMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Agora que todas as dependências estão fornecidas, o componente será criado sem erro.
    expect(component).toBeTruthy();
  });

  it('should load data on ngOnInit', () => {
    // Verifica se os métodos dos serviços foram chamados
    expect(medicosServiceSpy.getTotalConsultasCount).toHaveBeenCalled();
    expect(medicosServiceSpy.getProximasConsultasCount).toHaveBeenCalled();
    // Verifica se os contadores foram atualizados corretamente
    expect(component.totalConsultas).toBe(10);
    expect(component.proximasConsultas).toBe(3);
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('should handle error when loading data', () => {
    // Força os espiões a retornarem um erro
    medicosServiceSpy.getTotalConsultasCount.and.returnValue(throwError(() => new Error('API Error')));
    medicosServiceSpy.getProximasConsultasCount.and.returnValue(throwError(() => new Error('API Error')));
    
    // Recria o componente para disparar o ngOnInit novamente com o novo mock
    fixture = TestBed.createComponent(DashboardMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
    expect(component.error).toBe('Falha ao carregar os dados do dashboard.');
  });
});