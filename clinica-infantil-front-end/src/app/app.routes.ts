import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { EstadosComponent } from './components/estados/estados.component';
import { PacienteListComponent } from './features/secretaria/components/pacientes/paciente-list/paciente-list.component';
import { ConsultaFormComponent } from './features/secretaria/components/consultas/consulta-form/consulta-form.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'estados', component: EstadosComponent},
  { path: 'pacientes', component: PacienteListComponent},
  { path: 'consultas/agendar', component: ConsultaFormComponent},
  // Redireciona para o login se a rota raiz for acessada
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];