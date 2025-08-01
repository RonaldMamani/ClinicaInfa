import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adicionar-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adicionar-cliente.component.html',
  styleUrls: ['./adicionar-cliente.component.css']
})
export class AdicionarClienteComponent {
  constructor(private router: Router) { }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}