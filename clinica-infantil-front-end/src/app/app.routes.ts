import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { SecretariaComponent } from './views/secretaria/secretaria.component';
import { MedicoComponent } from './views/medico/medico.component';
import { AdministradorComponent } from './views/administrador/administrador.component';
import { ListarPacientesComponent } from './features/pacientes/listar-pacientes/listar-pacientes.component';
import { DetalhePacienteComponent } from './features/pacientes/detalhe-paciente/detalhe-paciente.component';
import { EditarPacienteComponent } from './features/pacientes/editar-paciente/editar-paciente.component';
import { DashboardSecretariaComponent } from './components/dashboard-secretaria/dashboard-secretaria.component';
import { AdicionarClienteComponent } from './features/clientes/adicionar-cliente/adicionar-cliente.component';
import { AdicionarPacienteComponent } from './features/pacientes/adicionar-paciente/adicionar-paciente.component';
import { AdicionarResponsavelComponent } from './features/responsaveis/adicionar-responsavel/adicionar-responsavel.component';
import { ListarConsultasAgendadasComponent } from './features/consultas/listar-consultas-agendadas/listar-consultas-agendadas.component';
import { ListarTodasConsultasComponent } from './features/consultas/listar-todas-consultas/listar-todas-consultas.component';
import { DetalhesConsultaComponent } from './features/consultas/detalhes-consulta/detalhes-consulta.component';
import { EditarConsultaComponent } from './features/consultas/editar-consulta/editar-consulta.component';
import { AdicionarConsultaComponent } from './features/consultas/adicionar-consulta/adicionar-consulta.component';
import { DetalhesConsultaAgendadaComponent } from './features/consultas/detalhes-consulta-agendada/detalhes-consulta-agendada.component';
import { RemarcarConsultaComponent } from './features/consultas/remarcar-consulta/remarcar-consulta.component';
import { MedicoConsultasComponent } from './features/consultas/medico-consultas/medico-consultas.component';
import { DashboardMedicoComponent } from './components/dashboard-medico/dashboard-medico.component';
import { AgendarConsultaComponent } from './features/consultas/agendar-consulta/agendar-consulta.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'secretaria',
    component: SecretariaComponent,
    canActivate: [authGuard],
    data: { expectedProfile: 'secretaria' },
    children: [
      { path: '', component: DashboardSecretariaComponent },
      { path: 'pacientes', component: ListarPacientesComponent },
      { path: 'pacientes/:id', component: DetalhePacienteComponent },
      { path: 'pacientes/editar/:id', component: EditarPacienteComponent },
      { path: 'clientes/adicionar', component: AdicionarClienteComponent },
      { path: 'clientes/adicionar/paciente', component: AdicionarPacienteComponent },
      { path: 'clientes/adicionar/responsavel', component: AdicionarResponsavelComponent },
      { path: 'consultas/agendadas', component: ListarConsultasAgendadasComponent },
      { path: 'consultas/agendadas/:id', component: DetalhesConsultaAgendadaComponent},
      { path: 'consultas/agendadas/:id/remarcar', component: RemarcarConsultaComponent },
      { path: 'consultas', component: ListarTodasConsultasComponent },
      { path: 'consultas/detalhes/:id', component: DetalhesConsultaComponent},
      { path: 'consultas/editar/:id', component: EditarConsultaComponent },
      { path: 'consultas/adicionar', component: AdicionarConsultaComponent },
      // O redirectTo deve ser o último elemento, redirecionando para a rota padrão
      { path: '**', redirectTo: '' }
    ]
  },
  {
    path: 'medico',
    component: MedicoComponent,
    canActivate: [authGuard],
    data: { expectedProfile: 'medico' },
    children: [
      { path: '', component: DashboardMedicoComponent },
      { path: 'consultas', component: MedicoConsultasComponent},
      { path: 'agendar', component: AgendarConsultaComponent},

      { path: '**', redirectTo: '' }
    ]
  },
  {
    path: 'administrador',
    component: AdministradorComponent,
    canActivate: [authGuard],
    data: { expectedProfile: 'administrador' }
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];