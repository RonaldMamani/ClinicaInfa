import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../controllers/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Se a requisição for para o endpoint de login, não adicione o token
  if (req.url.includes('/login')) {
    return next(req);
  }

  // Se houver um token, clone a requisição e adicione o header de Autorização
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  // Se não houver token, passe a requisição original
  return next(req);
};