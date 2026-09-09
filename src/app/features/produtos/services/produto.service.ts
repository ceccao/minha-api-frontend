import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../../core/models/paged-result.model';
import {
  Produto,
  CriarProdutoRequest,
  AtualizarProdutoRequest,
  AtualizarPrecoRequest,
  ListarProdutosParams
} from '../models/produto.model';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/produtos`;

  listar(params: ListarProdutosParams = {}): Observable<PagedResult<Produto>> {
    let httpParams = new HttpParams();

    // So envia o parametro se ele foi de fato informado - deixa a API aplicar
    // os defaults dela (Qt=10, Pg=1, CpOrd=Id, TpOrd=Ascendente) quando omitido.
    Object.entries(params).forEach(([chave, valor]) => {
      if (valor !== undefined && valor !== null) {
        httpParams = httpParams.set(chave, String(valor));
      }
    });

    return this.http.get<PagedResult<Produto>>(this.baseUrl, { params: httpParams });
  }

  obterPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/${id}`);
  }

  criar(request: CriarProdutoRequest): Observable<Produto> {
    return this.http.post<Produto>(this.baseUrl, request);
  }

  atualizar(id: number, request: AtualizarProdutoRequest): Observable<Produto> {
    return this.http.put<Produto>(`${this.baseUrl}/${id}`, request);
  }

  // Endpoint com retry no backend (Result Pattern) - em caso de conflito de
  // concorrencia persistente, a API responde 409 mesmo apos as tentativas internas.
  atualizarPreco(id: number, request: AtualizarPrecoRequest): Observable<Produto> {
    return this.http.patch<Produto>(`${this.baseUrl}/${id}/preco`, request);
  }

  // 204 No Content - sem corpo de resposta (soft delete no backend).
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}