import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProdutoService } from '../services/produto.service';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './produto-form.component.html',
  styleUrl: './produto-form.component.scss'
})
export class ProdutoFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly produtoService = inject(ProdutoService);
  private readonly router = inject(Router);

  protected readonly salvando = signal(false);
  protected readonly erro = signal<string | null>(null);

  // Mesmas regras do CriarProdutoCommandValidator (backend): nome obrigatorio ate
  // 100 caracteres, preco nao pode ser negativo. Validar no front nao dispensa a
  // validacao do backend (ela continua sendo a que vale de verdade) - e so pra
  // dar feedback mais rapido antes de rodar a requisicao.
  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    preco: [0, [Validators.required, Validators.min(0)]]
  });

  protected salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando.set(true);
    this.erro.set(null);

    this.produtoService.criar(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/produtos']),
      error: (err) => {
        // EntidadeInvalidaException (backend) poe as mensagens especificas em
        // "errors"; outras exceptions usam so o "title" do ProblemDetails.
        const problemDetails = err?.error;
        this.erro.set(
          problemDetails?.errors?.length
            ? problemDetails.errors.join(' ')
            : (problemDetails?.title ?? 'Não foi possível criar o produto.')
        );
        this.salvando.set(false);
      }
    });
  }
}