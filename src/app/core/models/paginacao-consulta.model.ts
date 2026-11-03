// Espelha MinhaApi.Domain.Abstractions.PaginacaoConsulta<T> (backend). Manter os dois
// lados alinhados e o que faz o contrato da API valer a pena.
export interface PaginacaoConsulta<T> {
  itens: T[];
  pagina: number;
  tamanhoPagina: number;
  totalItens: number;
  totalPaginas: number;
}
