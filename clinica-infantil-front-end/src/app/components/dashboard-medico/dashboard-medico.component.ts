import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-medico',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-medico.component.html',
  styleUrl: './dashboard-medico.component.css'
})
export class DashboardMedicoComponent {

}
