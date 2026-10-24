// Espelha MinhaApi.Domain.Abstractions.TipoOrdenacao (backend).
export type TipoOrdenacao = 'Ascendente' | 'Descendente';

// Espelha MinhaApi.CrossCutting.Enums.Situacao (backend): a API devolve o numero.
export enum Situacao {
  Inativo = 0,
  Ativo = 1
}

// Campos pelos quais a API aceita ordenar (ListarProdutosRequestValidator, backend).
// Qualquer outro valor devolve 400.
export type CampoOrdenacaoProduto = 'Id' | 'Nome' | 'Preco' | 'Situacao';

// Espelha ProdutoResponse (backend).
export interface Produto {
  id: number;
  nome: string;
  preco: number;
  situacao: Situacao;
  criadoEm: string; // ISO 8601 em UTC - vira Date so na hora de exibir
  atualizadoEm: string | null;
  version: number; // devolva na edicao: se outra pessoa editou antes, a API responde 409
}

// Espelha ProdutoRequest (backend) - serve para criar e para editar.
export interface ProdutoRequest {
  nome: string;
  preco: number;
  version?: number;
}

// Espelha ListarProdutosRequest (backend). Os nomes batem com os query params:
// qt, pg, cpOrd, tpOrd (paginacao/ordenacao) e nome, situacao (filtros).
export interface ListarProdutosParams {
  qt?: number;
  pg?: number;
  cpOrd?: CampoOrdenacaoProduto;
  tpOrd?: TipoOrdenacao;
  nome?: string;
  situacao?: Situacao;
}
