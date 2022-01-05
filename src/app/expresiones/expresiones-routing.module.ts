import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListExpresionesComponent } from './list-expresiones/list-expresiones.component';

const routes: Routes = [
  { path: '', component: ListExpresionesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpresionesRoutingModule { }
