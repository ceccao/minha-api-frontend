import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from './auth.service';

function configurar(): { auth: AuthService; http: HttpTestingController; router: Router } {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
  });
  return {
    auth: TestBed.inject(AuthService),
    http: TestBed.inject(HttpTestingController),
    router: TestBed.inject(Router)
  };
}

describe('AuthService', () => {
  beforeEach(() => sessionStorage.clear());

  it('comeca sem sessao', () => {
    const { auth } = configurar();

    expect(auth.autenticado()).toBe(false);
    expect(auth.token).toBeNull();
  });

  it('login guarda o token e marca como autenticado', () => {
    const { auth, http } = configurar();
    const expiraEm = new Date(Date.now() + 60_000).toISOString();

    auth.login({ email: 'a@b.com', senha: 'x' }).subscribe();
    http.expectOne('/api/v1/auth/login').flush({ token: 'abc', expiraEm });

    expect(auth.autenticado()).toBe(true);
    expect(auth.token).toBe('abc');
    expect(sessionStorage.getItem('minha-api.token')).toBe('abc');
  });

  it('logout limpa a sessao e vai para o login', () => {
    sessionStorage.setItem('minha-api.token', 'abc');
    sessionStorage.setItem('minha-api.expira-em', new Date(Date.now() + 60_000).toISOString());
    const { auth, router } = configurar();
    const navegar = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    auth.logout();

    expect(auth.autenticado()).toBe(false);
    expect(sessionStorage.getItem('minha-api.token')).toBeNull();
    expect(navegar).toHaveBeenCalledWith(['/login']);
  });

  it('descarta token expirado ao iniciar', () => {
    sessionStorage.setItem('minha-api.token', 'velho');
    sessionStorage.setItem('minha-api.expira-em', new Date(Date.now() - 1000).toISOString());

    const { auth } = configurar();

    expect(auth.autenticado()).toBe(false);
    expect(sessionStorage.getItem('minha-api.token')).toBeNull();
  });
});
