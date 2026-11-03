import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaginacaoConsulta } from '../../../core/models/paginacao-consulta.model';
import { Produto, ProdutoRequest, ListarProdutosParams } from '../models/produto.model';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/produtos`;

  listar(params: ListarProdutosParams = {}): Observable<PaginacaoConsulta<Produto>> {
    let httpParams = new HttpParams();

    // So envia o parametro se ele foi de fato informado - deixa a API aplicar
    // os defaults dela (Qt=10, Pg=1, CpOrd=Id, TpOrd=Ascendente) quando omitido.
    Object.entries(params).forEach(([chave, valor]) => {
      if (valor !== undefined && valor !== null && valor !== '') {
        httpParams = httpParams.set(chave, String(valor));
      }
    });

    return this.http.get<PaginacaoConsulta<Produto>>(this.baseUrl, { params: httpParams });
  }

  obterPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/${id}`);
  }

  criar(request: ProdutoRequest): Observable<Produto> {
    return this.http.post<Produto>(this.baseUrl, request);
  }

  // Envie a version recebida na leitura: se outra pessoa alterou o produto no meio
  // tempo, a API responde 409 em vez de sobrescrever.
  atualizar(id: number, request: ProdutoRequest): Observable<Produto> {
    return this.http.put<Produto>(`${this.baseUrl}/${id}`, request);
  }

  // Soft delete no backend: o produto vira Inativo. A API devolve 204 sem corpo.
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
