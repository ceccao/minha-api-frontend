import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

// Anexa o token so nas chamadas para a PROPRIA API (nunca para outros dominios) e, se a
// API responder 401 numa rota protegida, encerra a sessao e manda para o login.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const paraNossaApi = req.url.startsWith(environment.apiUrl);
  const ehLogin = req.url.endsWith('/auth/login');

  const requisicao =
    paraNossaApi && auth.token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${auth.token}` } })
      : req;

  return next(requisicao).pipe(
    catchError((erro: unknown) => {
      if (erro instanceof HttpErrorResponse && erro.status === 401 && paraNossaApi && !ehLogin) {
        auth.logout();
      }
      return throwError(() => erro);
    })
  );
};
