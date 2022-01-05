import { ListElementosGastosComponent } from './list-elementos-gastos/list-elementos-gastos.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ListElementosGastosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElementosGastosRoutingModule { }
