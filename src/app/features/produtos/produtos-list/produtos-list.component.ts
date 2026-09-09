import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ProdutoService } from '../services/produto.service';
import { Produto } from '../models/produto.model';

@Component({
  selector: 'app-produtos-list',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './produtos-list.component.html',
  styleUrl: './produtos-list.component.scss'
})
export class ProdutosListComponent implements OnInit {
  private readonly produtoService = inject(ProdutoService);

  protected readonly produtos = signal<Produto[]>([]);
  protected readonly carregando = signal(true);
  protected readonly erro = signal<string | null>(null);
  protected readonly totalItens = signal(0);

  ngOnInit(): void {
    this.carregar();
  }

  protected carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.produtoService.listar().subscribe({
      next: (resultado) => {
        this.produtos.set(resultado.itens);
        this.totalItens.set(resultado.totalItens);
        this.carregando.set(false);
      },
      // Tratamento de erro basico por enquanto - a FASE 16 (interceptor de erro
      // lendo ProblemDetails) deixa isso mais rico, com a mensagem real da API.
      error: () => {
        this.erro.set('Não foi possível carregar os produtos. Tente novamente.');
        this.carregando.set(false);
      }
    });
  }
}