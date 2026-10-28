import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ProblemDetails } from '../../core/models/problem-details.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly entrando = signal(false);
  protected readonly erro = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]]
  });

  protected entrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.entrando.set(true);
    this.erro.set(null);

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => void this.router.navigate(['/produtos']),
      error: (err: HttpErrorResponse) => {
        this.erro.set(this.mensagemDeErro(err));
        this.entrando.set(false);
      }
    });
  }

  private mensagemDeErro(err: HttpErrorResponse): string {
    if (err.status === 429) {
      return 'Muitas tentativas. Aguarde um minuto e tente de novo.';
    }

    // 401 traz sempre a mesma mensagem generica (a API nao diz se o e-mail existe).
    const problema = err.error as ProblemDetails | null;
    return problema?.errors?.length
      ? problema.errors.join(' ')
      : (problema?.title ?? 'Não foi possível entrar. Tente novamente.');
  }
}
