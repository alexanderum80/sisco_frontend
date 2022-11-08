import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstadisticaContabilidadComponent } from './estadistica-contabilidad.component';

const routes: Routes = [
  { path: '', component: EstadisticaContabilidadComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstadisticaContabilidadRoutingModule {}
