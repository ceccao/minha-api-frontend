import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProdutoService } from '../services/produto.service';
import { ListarProdutosParams, Produto, Situacao } from '../models/produto.model';

@Component({
  selector: 'app-produtos-list',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './produtos-list.component.html',
  styleUrl: './produtos-list.component.scss'
})
export class ProdutosListComponent implements OnInit {
  private readonly produtoService = inject(ProdutoService);

  protected readonly Situacao = Situacao;

  protected readonly produtos = signal<Produto[]>([]);
  protected readonly carregando = signal(true);
  protected readonly erro = signal<string | null>(null);
  protected readonly totalItens = signal(0);
  protected readonly pagina = signal(1);
  protected readonly totalPaginas = signal(1);

  // Filtros aceitos pela API: nome e situacao.
  protected filtroNome = '';
  protected filtroSituacao: '' | Situacao = '';

  ngOnInit(): void {
    this.carregar();
  }

  protected filtrar(): void {
    this.pagina.set(1);
    this.carregar();
  }

  protected irParaPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas()) {
      return;
    }
    this.pagina.set(pagina);
    this.carregar();
  }

  protected carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);

    const params: ListarProdutosParams = {
      pg: this.pagina(),
      nome: this.filtroNome.trim() || undefined,
      situacao: this.filtroSituacao === '' ? undefined : this.filtroSituacao
    };

    this.produtoService.listar(params).subscribe({
      next: (resultado) => {
        this.produtos.set(resultado.itens);
        this.totalItens.set(resultado.totalItens);
        this.totalPaginas.set(Math.max(resultado.totalPaginas, 1));
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
