import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DashboardAdministradorComponent } from './dashboard-administrador.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DashboardAdministradorComponent', () => {
  let component: DashboardAdministradorComponent;
  let fixture: ComponentFixture<DashboardAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardAdministradorComponent,
        RouterTestingModule, // Adicionado para fornecer o ActivatedRoute
        HttpClientTestingModule, // Adicionado para mockar o HttpClient
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
