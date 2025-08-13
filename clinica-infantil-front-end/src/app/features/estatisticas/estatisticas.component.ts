import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstatisticasConsultasComponent } from "../../components/estatisticas/estatisticas-consultas/estatisticas-consultas.component";
import { ConsultasService } from '../../controllers/consultas/consultas.service';
import { EstatisticasPacientesComponent } from "../../components/estatisticas/estatisticas-pacientes/estatisticas-pacientes.component";
import { EstadosService } from '../../controllers/estados/estados.service';
import { EstatisticasReceitaComponent } from "../../components/estatisticas/estatisticas-receita/estatisticas-receita.component";
import { EstatisticasEspecialidadesComponent } from "../../components/estatisticas/estatisticas-especialidades/estatisticas-especialidades.component";
import { EstatisticasGeneroComponent } from "../../components/estatisticas/estatisticas-genero/estatisticas-genero.component";
import { EstatisticasClientesComponent } from "../../components/estatisticas/estatisticas-clientes/estatisticas-clientes.component";
import { EstatisticasMedicosComponent } from "../../components/estatisticas/estatisticas-medicos/estatisticas-medicos.component";
import { EstatisticasResponsaveisComponent } from "../../components/estatisticas/estatisticas-responsaveis/estatisticas-responsaveis.component";
import { EstatisticasPacienteConsultasComponent } from "../../components/estatisticas/estatisticas-paciente-consultas/estatisticas-paciente-consultas.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-estatisticas',
  imports: [CommonModule, 
    RouterLink, EstatisticasPacientesComponent, 
    EstatisticasReceitaComponent, EstatisticasEspecialidadesComponent, 
    EstatisticasGeneroComponent, EstatisticasClientesComponent, 
    EstatisticasMedicosComponent, EstatisticasResponsaveisComponent, 
    EstatisticasPacienteConsultasComponent, EstatisticasConsultasComponent],
  providers: [ConsultasService, EstadosService],
  templateUrl: './estatisticas.component.html',
  styleUrl: './estatisticas.component.css'
})
export class EstatisticasComponent {

}