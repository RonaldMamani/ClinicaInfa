import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotaoVoltarComponent } from './botao-voltar.component';

describe('BotaoVoltarComponent', () => {
  let component: BotaoVoltarComponent;
  let fixture: ComponentFixture<BotaoVoltarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotaoVoltarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotaoVoltarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
