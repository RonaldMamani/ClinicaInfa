import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Se seu app.component.html usar diretivas comuns
import { RouterOutlet } from '@angular/router'; // Se você estiver usando o roteador
import { EstadosComponent } from './estados/estados.component';

@Component({
  selector: 'app-root',
  standalone: true, // Seu componente raiz também deve ser standalone
  imports: [CommonModule, EstadosComponent], // Adicione o EstadosComponent aqui!
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend-clinica';
}
