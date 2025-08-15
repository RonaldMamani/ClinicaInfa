import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-botao-voltar',
  imports: [CommonModule, RouterLink],
  templateUrl: './botao-voltar.component.html',
  styleUrl: './botao-voltar.component.css'
})
export class BotaoVoltarComponent {
  @Input() routerLink: string = '/';

  /**
   * O texto a ser exibido no botão.
   */
  @Input() texto: string = 'Voltar';
}
