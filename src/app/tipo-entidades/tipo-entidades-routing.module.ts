import { ListTipoEntidadesComponent } from './list-tipo-entidades/list-tipo-entidades.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: ListTipoEntidadesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TipoEntidadesRoutingModule {}
