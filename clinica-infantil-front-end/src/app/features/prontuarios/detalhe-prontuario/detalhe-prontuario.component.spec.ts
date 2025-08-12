import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DetalheProntuarioComponent } from './detalhe-prontuario.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('DetalheProntuarioComponent', () => {
  let component: DetalheProntuarioComponent;
  let fixture: ComponentFixture<DetalheProntuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DetalheProntuarioComponent,
        RouterTestingModule, // Adicionado para fornecer o ActivatedRoute
        HttpClientTestingModule, // Adicionado para mockar o HttpClient
      ],
      providers: [
        // Mock do ActivatedRoute para simular um parâmetro de ID na URL
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '123' // Simula o ID '123'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalheProntuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});