import { Routes } from '@angular/router';
import { ProdutosListComponent } from './features/produtos/produtos-list/produtos-list.component';

export const routes: Routes = [
  { path: 'produtos', component: ProdutosListComponent },
  { path: '', redirectTo: 'produtos', pathMatch: 'full' }
];