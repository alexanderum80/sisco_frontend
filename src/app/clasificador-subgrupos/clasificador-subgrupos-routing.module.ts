import { ListClasificadorSubgruposComponent } from './list-clasificador-subgrupos/list-clasificador-subgrupos.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ListClasificadorSubgruposComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClasificadorSubgruposRoutingModule {}
