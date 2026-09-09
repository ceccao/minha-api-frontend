// Espelha MinhaApi.Application.Common.PagedResult<T> (backend). Manter os dois
// lados alinhados é o que faz o contrato da API valer a pena.
export interface PagedResult<T> {
  itens: T[];
  pagina: number;
  tamanhoPagina: number;
  totalItens: number;
  totalPaginas: number;
}