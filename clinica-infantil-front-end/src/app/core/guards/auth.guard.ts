import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../controllers/auth/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    take(1), // Pega apenas o primeiro valor e completa o observable
    map(isLoggedIn => {
      if (isLoggedIn) {
        // Se o usuário está logado, vamos verificar o perfil
        const expectedProfile = route.data['expectedProfile']; // Obtém o perfil esperado da rota

        if (expectedProfile) {
          // Se há um perfil esperado para esta rota
          const currentUserProfile = authService.getToken() ? localStorage.getItem('user_profile') : null; // Pega o perfil diretamente do localStorage para uma verificação síncrona
          
          if (currentUserProfile && currentUserProfile === expectedProfile) {
            console.log(`Acesso concedido para ${currentUserProfile} na rota: ${state.url}`);
            return true; // Perfil compatível
          } else {
            console.warn(`Acesso NEGADO: Perfil "${currentUserProfile}" não tem permissão para a rota "${state.url}". Esperado: "${expectedProfile}"`);
            // Se o perfil não for compatível, redirecione para o dashboard correto ou para o login
            // Uma boa prática seria redirecionar para o próprio dashboard, que já fará o redirecionamento baseado no perfil.
            router.navigate(['/dashboard']);
            return false;
          }
        } else {
          // Se não há um perfil esperado na rota (ex: dashboard principal)
          console.log(`Acesso concedido (logado) para a rota: ${state.url}`);
          return true;
        }
      } else {
        // Se não está logado, redirecione para a página de login
        console.warn(`Acesso NEGADO: Não logado para a rota: ${state.url}`);
        router.navigate(['/login']);
        return false;
      }
    })
  );
};