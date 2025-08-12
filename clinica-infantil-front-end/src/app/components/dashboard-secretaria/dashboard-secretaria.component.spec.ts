import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DashboardSecretariaComponent } from './dashboard-secretaria.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DashboardSecretariaComponent', () => {
  let component: DashboardSecretariaComponent;
  let fixture: ComponentFixture<DashboardSecretariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardSecretariaComponent,
        RouterTestingModule, // Adicionado para fornecer os serviços de roteamento
        HttpClientTestingModule // Adicionado para mockar as chamadas HTTP
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardSecretariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
