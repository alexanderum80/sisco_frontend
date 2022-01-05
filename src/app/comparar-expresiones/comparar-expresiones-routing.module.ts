import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCompararExpresionesComponent } from './list-comparar-expresiones/list-comparar-expresiones.component';

const routes: Routes = [
  { path: '', component: ListCompararExpresionesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompararExpresionesRoutingModule { }
