import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParteEstadisticaContabilidadComponent } from './parte-estadistica-contabilidad.component';

const routes: Routes = [
  { path: '', component: ParteEstadisticaContabilidadComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParteEstadisticaContabilidadRoutingModule {}
