import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-medico',
  standalone: true,
  imports: [CommonModule ,NavbarComponent, FooterComponent, RouterOutlet, HttpClientModule],
  templateUrl: './medico.component.html',
  styleUrl: './medico.component.css'
})
export class MedicoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
