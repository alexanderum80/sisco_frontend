import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListClasificadorEntidadesComponent } from './list-clasificador-entidades/list-clasificador-entidades.component';

const routes: Routes = [
  { path: '', component: ListClasificadorEntidadesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClasificadorEntidadesRoutingModule { }
