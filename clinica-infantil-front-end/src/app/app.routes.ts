import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { SecretariaComponent } from './views/secretaria/secretaria.component';
import { MedicoComponent } from './views/medico/medico.component';
import { AdministradorComponent } from './views/administrador/administrador.component';

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
    data: { expectedProfile: 'secretaria' }
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
  // Redireciona para o login se a rota raiz for acessada
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];