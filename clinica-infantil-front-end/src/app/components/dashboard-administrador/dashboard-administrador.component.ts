import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstatisticasPacientesComponent } from "../estatisticas/estatisticas-pacientes/estatisticas-pacientes.component";
import { EstatisticasResponsaveisComponent } from "../estatisticas/estatisticas-responsaveis/estatisticas-responsaveis.component";

@Component({
  selector: 'app-dashboard-administrador',
  imports: [CommonModule, RouterLink, EstatisticasPacientesComponent],
  templateUrl: './dashboard-administrador.component.html',
  styleUrl: './dashboard-administrador.component.css'
})
export class DashboardAdministradorComponent {

}
