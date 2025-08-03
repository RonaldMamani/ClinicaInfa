import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-medico',
  standalone: true,
  imports: [CommonModule ,NavbarComponent, FooterComponent, RouterOutlet],
  templateUrl: './medico.component.html',
  styleUrl: './medico.component.css'
})
export class MedicoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Lógica de inicialização do componente de dashboard da secretária.
    // Você pode, por exemplo, carregar dados de resumo ou estatísticas aqui.
  }
}
