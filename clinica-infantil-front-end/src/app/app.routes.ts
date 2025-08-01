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
//import { AdicionarClienteComponent } from './features/clientes/adicionar-cliente/adicionar-cliente.component';
//import { AgendarConsultaComponent } from './features/consultas/agendar-consulta/agendar-consulta.component';

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

      // Rota para o menu de seleção
      { path: 'clientes/adicionar', component: AdicionarClienteComponent },

      // Rotas para os novos formulários
      { path: 'clientes/adicionar/paciente', component: AdicionarPacienteComponent },
      { path: 'clientes/adicionar/responsavel', component: AdicionarResponsavelComponent },

      // O redirectTo deve ser o último elemento, redirecionando para a rota padrão
      { path: '**', redirectTo: '' }
    ]
  },
  {
    path: 'medico',
    component: MedicoComponent,
    canActivate: [authGuard],
    data: { expectedProfile: 'medico' }
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