import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { authGuard } from './auth.guard';

function executarGuard(): boolean | UrlTree {
  return TestBed.runInInjectionContext(() =>
    authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
  ) as boolean | UrlTree;
}

describe('authGuard', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient()] });
  });

  it('sem sessao redireciona para /login', () => {
    const resultado = executarGuard();

    expect(resultado).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(resultado as UrlTree)).toBe('/login');
  });
});

describe('authGuard com sessao', () => {
  beforeEach(() => {
    sessionStorage.setItem('minha-api.token', 'abc');
    sessionStorage.setItem('minha-api.expira-em', new Date(Date.now() + 60_000).toISOString());
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient()] });
  });

  it('libera a rota', () => {
    expect(executarGuard()).toBe(true);
  });
});
