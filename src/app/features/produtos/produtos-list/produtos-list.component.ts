import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProdutoService } from '../services/produto.service';
import { Produto } from '../models/produto.model';

@Component({
  selector: 'app-produtos-list',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
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
      error: () => {
        this.erro.set('Não foi possível carregar os produtos. Tente novamente.');
        this.carregando.set(false);
      }
    });
  }

  protected excluir(produto: Produto): void {
    // Confirm() nativo por simplicidade - sem dependencia nova so pra isso.
    // Trocar por um modal de verdade fica pra quando o design system entrar.
    const confirmou = confirm(`Tem certeza que deseja excluir "${produto.nome}"?`);
    if (!confirmou) {
      return;
    }

    this.produtoService.excluir(produto.id).subscribe({
      next: () => this.carregar(),
      error: () => {
        this.erro.set(`Não foi possível excluir "${produto.nome}".`);
      }
    });
  }
}