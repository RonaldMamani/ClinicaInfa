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
import { MedicoConsultasAgendadosComponent } from './features/consultas/medico-consultas-agendados/medico-consultas-agendados.component';
import { AtenderConsultaComponent } from './features/consultas/atender-consulta/atender-consulta.component';
import { ListarProntuariosComponent } from './features/prontuarios/listar-prontuarios/listar-prontuarios.component';
import { DetalheProntuarioComponent } from './features/prontuarios/detalhe-prontuario/detalhe-prontuario.component';

import { DashboardAdministradorComponent } from './components/dashboard-administrador/dashboard-administrador.component';
import { ListarResponsaveisComponent } from './features/responsaveis/listar-responsaveis/listar-responsaveis.component';
import { ListarFuncionariosComponent } from './features/funcionarios/listar-funcionarios/listar-funcionarios.component';
import { DetalhesResponsavelComponent } from './features/responsaveis/detalhes-responsavel/detalhes-responsavel.component';
import { EditarResponsavelComponent } from './features/responsaveis/editar-responsavel/editar-responsavel.component';

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
      { path: 'pacientes/:id/editar', component: EditarPacienteComponent },
      { path: 'clientes/adicionar', component: AdicionarClienteComponent },
      { path: 'clientes/adicionar/paciente', component: AdicionarPacienteComponent },
      { path: 'clientes/adicionar/responsavel', component: AdicionarResponsavelComponent },
      { path: 'consultas/agendadas', component: ListarConsultasAgendadasComponent },
      { path: 'consultas/agendadas/:id', component: DetalhesConsultaAgendadaComponent},
      { path: 'consultas/agendadas/:id/remarcar', component: RemarcarConsultaComponent },
      { path: 'consultas', component: ListarTodasConsultasComponent },
      { path: 'consultas/:id', component: DetalhesConsultaComponent},
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
      { path: 'consultas/:id', component: DetalhesConsultaComponent},
      { path: 'agendados', component: MedicoConsultasAgendadosComponent},
      { path: 'agendados/:id/remarcar', component: RemarcarConsultaComponent },
      { path: 'agendados/:id/atender', component: AtenderConsultaComponent },
      { path: 'agendar', component: AgendarConsultaComponent},
      { path: 'prontuarios', component: ListarProntuariosComponent },
      { path: 'prontuarios/:id', component: DetalheProntuarioComponent },

      { path: '**', redirectTo: '' }
    ]
  },
  {
    path: 'administrador',
    component: AdministradorComponent,
    canActivate: [authGuard],
    data: { expectedProfile: 'administrador' },
    children: [
      { path: '', component: DashboardAdministradorComponent },
      { path: 'consultas', component: ListarTodasConsultasComponent },
      { path: 'consultas/:id', component: DetalhesConsultaComponent},
      { path: 'pacientes', component: ListarPacientesComponent },
      { path: 'pacientes/adicionar', component: AdicionarPacienteComponent },
      { path: 'pacientes/:id', component: DetalhePacienteComponent },
      { path: 'pacientes/:id/editar', component: EditarPacienteComponent },
      { path: 'responsaveis', component: ListarResponsaveisComponent },
      { path: 'responsaveis/adicionar', component: AdicionarResponsavelComponent },
      { path: 'responsaveis/:id', component: DetalhesResponsavelComponent },
      { path: 'responsaveis/:id/editar', component: EditarResponsavelComponent },
      { path: 'funcionarios', component: ListarFuncionariosComponent },

      { path: '**', redirectTo: '' }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];