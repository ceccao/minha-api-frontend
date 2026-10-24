import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let auth: AuthService;

  beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem('minha-api.token', 'meu-token');
    sessionStorage.setItem('minha-api.expira-em', new Date(Date.now() + 60_000).toISOString());

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
  });

  it('envia o Bearer para a propria API', () => {
    http.get('/api/v1/produtos').subscribe();

    const req = controller.expectOne('/api/v1/produtos');
    expect(req.request.headers.get('Authorization')).toBe('Bearer meu-token');
  });

  it('nao envia o token para outro dominio', () => {
    http.get('https://outro-site.com/x').subscribe();

    const req = controller.expectOne('https://outro-site.com/x');
    expect(req.request.headers.has('Authorization')).toBe(false);
  });

  it('encerra a sessao quando a API responde 401', () => {
    const logout = vi.spyOn(auth, 'logout').mockImplementation(() => undefined);

    http.get('/api/v1/produtos').subscribe({ error: () => undefined });
    controller.expectOne('/api/v1/produtos').flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(logout).toHaveBeenCalled();
  });

  it('401 no proprio login nao derruba a sessao (e so senha errada)', () => {
    const logout = vi.spyOn(auth, 'logout').mockImplementation(() => undefined);

    http.post('/api/v1/auth/login', {}).subscribe({ error: () => undefined });
    controller.expectOne('/api/v1/auth/login').flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(logout).not.toHaveBeenCalled();
  });
});
