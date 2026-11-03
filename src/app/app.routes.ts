import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/login/login.component';
import { ProdutosListComponent } from './features/produtos/produtos-list/produtos-list.component';
import { ProdutoFormComponent } from './features/produtos/produto-form/produto-form.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'produtos', component: ProdutosListComponent, canActivate: [authGuard] },
  { path: 'produtos/novo', component: ProdutoFormComponent, canActivate: [authGuard] },
  { path: 'produtos/:id/editar', component: ProdutoFormComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'produtos', pathMatch: 'full' },
  { path: '**', redirectTo: 'produtos' }
];
