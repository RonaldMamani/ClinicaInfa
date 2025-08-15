import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BotaoVoltarComponent } from "../../../components/botao-voltar/botao-voltar.component";

@Component({
  selector: 'app-adicionar-cliente',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, BotaoVoltarComponent],
  templateUrl: './adicionar-cliente.component.html',
  styleUrls: ['./adicionar-cliente.component.css']
})
export class AdicionarClienteComponent {
  constructor(private router: Router) { }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}