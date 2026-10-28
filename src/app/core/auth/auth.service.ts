import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

// Espelha LoginRequest / LoginResponse (backend, Application/Autenticacao).
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  expiraEm: string; // ISO 8601 em UTC
}

const CHAVE_TOKEN = 'minha-api.token';
const CHAVE_EXPIRACAO = 'minha-api.expira-em';

// Guarda o token em sessionStorage: some ao fechar a aba. Compromisso consciente: qualquer
// script que rodar na pagina (XSS) consegue le-lo; por isso o backend envia CSP restrita e
// o Angular escapa todo conteudo. Se o template exigir mais, troque por cookie HttpOnly.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _token = signal<string | null>(this.lerTokenValido());

  readonly autenticado = computed(() => this._token() !== null);

  get token(): string | null {
    return this._token();
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, request)
      .pipe(tap((resposta) => this.guardar(resposta)));
  }

  logout(): void {
    this._token.set(null);
    this.armazenamento()?.removeItem(CHAVE_TOKEN);
    this.armazenamento()?.removeItem(CHAVE_EXPIRACAO);
    void this.router.navigate(['/login']);
  }

  private guardar(resposta: LoginResponse): void {
    this.armazenamento()?.setItem(CHAVE_TOKEN, resposta.token);
    this.armazenamento()?.setItem(CHAVE_EXPIRACAO, resposta.expiraEm);
    this._token.set(resposta.token);
  }

  // Token expirado e descartado ja na abertura da aplicacao.
  private lerTokenValido(): string | null {
    const token = this.armazenamento()?.getItem(CHAVE_TOKEN) ?? null;
    const expiraEm = this.armazenamento()?.getItem(CHAVE_EXPIRACAO) ?? null;

    if (!token || !expiraEm || new Date(expiraEm).getTime() <= Date.now()) {
      this.armazenamento()?.removeItem(CHAVE_TOKEN);
      this.armazenamento()?.removeItem(CHAVE_EXPIRACAO);
      return null;
    }

    return token;
  }

  // sessionStorage pode lancar (modo privado, politicas do navegador): a app segue sem ele.
  private armazenamento(): Storage | null {
    try {
      return sessionStorage;
    } catch {
      return null;
    }
  }
}
