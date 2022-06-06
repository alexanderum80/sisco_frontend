import { ListClasificadorCuentaComponent } from './list-clasificador-cuenta/list-clasificador-cuenta.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ListClasificadorCuentaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClasificadorCuentaRoutingModule {}
