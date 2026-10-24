import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

// Protege as rotas: sem token valido, vai para o login. Isto e so conforto de navegacao;
// quem realmente protege os dados e a API (401 sem token).
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.autenticado() ? true : router.createUrlTree(['/login']);
};
