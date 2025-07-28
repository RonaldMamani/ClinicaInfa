import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { EstadosComponent } from './components/estados/estados.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, EstadosComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend-clinica';
}