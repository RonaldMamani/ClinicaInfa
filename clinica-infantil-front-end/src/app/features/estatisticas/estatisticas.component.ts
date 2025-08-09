import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstatisticasConsultasComponent } from "../../components/estatisticas/estatisticas-consultas/estatisticas-consultas.component";
import { ConsultasService } from '../../controllers/consultas/consultas.service';
import { EstatisticasPacientesComponent } from "../../components/estatisticas/estatisticas-pacientes/estatisticas-pacientes.component";
import { EstadosService } from '../../controllers/estados/estados.service';
import { EstatisticasReceitaComponent } from "../../components/estatisticas/estatisticas-receita/estatisticas-receita.component";

@Component({
  selector: 'app-estatisticas',
  imports: [CommonModule, EstatisticasConsultasComponent, EstatisticasPacientesComponent, EstatisticasReceitaComponent],
  providers: [ConsultasService, EstadosService],
  templateUrl: './estatisticas.component.html',
  styleUrl: './estatisticas.component.css'
})
export class EstatisticasComponent {

}