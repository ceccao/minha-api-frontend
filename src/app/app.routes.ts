import { Routes } from '@angular/router';
import { ProdutosListComponent } from './features/produtos/produtos-list/produtos-list.component';
import { ProdutoFormComponent } from './features/produtos/produto-form/produto-form.component';

export const routes: Routes = [
  { path: 'produtos', component: ProdutosListComponent },
  { path: 'produtos/novo', component: ProdutoFormComponent },
  { path: 'produtos/:id/editar', component: ProdutoFormComponent },
  { path: '', redirectTo: 'produtos', pathMatch: 'full' }
];