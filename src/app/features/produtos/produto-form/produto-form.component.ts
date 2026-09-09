import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProdutoService } from '../services/produto.service';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './produto-form.component.html',
  styleUrl: './produto-form.component.scss'
})
export class ProdutoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly produtoService = inject(ProdutoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly salvando = signal(false);
  protected readonly carregando = signal(false);
  protected readonly erro = signal<string | null>(null);
  protected readonly modoEdicao = signal(false);

  private produtoId: number | null = null;

  // Mesmas regras do Criar/AtualizarProdutoCommandValidator (backend): nome
  // obrigatorio ate 100 caracteres, preco nao pode ser negativo.
  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    preco: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    // Presenca do :id na rota decide o modo - /produtos/novo nao tem parametro,
    // /produtos/:id/editar tem. Um so componente serve pros dois casos.
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.produtoId = Number(idParam);
      this.modoEdicao.set(true);
      this.carregarProduto(this.produtoId);
    }
  }

  private carregarProduto(id: number): void {
    this.carregando.set(true);

    this.produtoService.obterPorId(id).subscribe({
      next: (produto) => {
        this.form.patchValue({ nome: produto.nome, preco: produto.preco });
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar o produto.');
        this.carregando.set(false);
      }
    });
  }

  protected salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando.set(true);
    this.erro.set(null);

    const request = this.form.getRawValue();

    // Em modo edicao chama atualizar(); senao, criar(). O tratamento de erro e
    // compartilhado - cobre tanto EntidadeInvalidaException (400) quanto
    // ConflitoException (409, concorrencia otimista) do PUT.
    const operacao =
      this.modoEdicao() && this.produtoId !== null
        ? this.produtoService.atualizar(this.produtoId, request)
        : this.produtoService.criar(request);

    operacao.subscribe({
      next: () => this.router.navigate(['/produtos']),
      error: (err) => {
        const problemDetails = err?.error;
        this.erro.set(
          problemDetails?.errors?.length
            ? problemDetails.errors.join(' ')
            : (problemDetails?.title ?? 'Não foi possível salvar o produto.')
        );
        this.salvando.set(false);
      }
    });
  }
}