// Espelha MinhaApi.Domain.Abstractions.TipoOrdenacao (backend).
export type TipoOrdenacao = 'Ascendente' | 'Descendente';

// Espelha MinhaApi.Application.Produtos.DataTransfer.Responses.ProdutoResponse.
export interface Produto {
  id: number;
  nome: string;
  preco: number;
  ativo: boolean;
  criadoEm: string; // ISO 8601 - vira Date só na hora de exibir, se precisar
  atualizadoEm: string | null;
}

// Espelha CriarProdutoRequest.
export interface CriarProdutoRequest {
  nome: string;
  preco: number;
}

// Espelha AtualizarProdutoRequest.
export interface AtualizarProdutoRequest {
  nome: string;
  preco: number;
}

// Espelha AtualizarPrecoRequest.
export interface AtualizarPrecoRequest {
  novoPreco: number;
}

// Espelha ListarProdutosRequest (que herda de PaginacaoFiltro no backend) - os
// nomes de propriedade batem exatamente com os query params esperados pela API
// (qt, pg, cpOrd, tpOrd, nome, precoMinimo, precoMaximo, ativo).
export interface ListarProdutosParams {
  qt?: number;
  pg?: number;
  cpOrd?: string;
  tpOrd?: TipoOrdenacao;
  nome?: string;
  precoMinimo?: number;
  precoMaximo?: number;
  ativo?: boolean;
}