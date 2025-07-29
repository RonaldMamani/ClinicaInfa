import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { EstadosComponent } from './components/estados/estados.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'estados', component: EstadosComponent},
  // Redireciona para o login se a rota raiz for acessada
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];