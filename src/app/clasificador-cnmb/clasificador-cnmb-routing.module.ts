import { ListClasificadorCnmbComponent } from './list-clasificador-cnmb/list-clasificador-cnmb.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: ListClasificadorCnmbComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClasificadorCnmbRoutingModule {}
