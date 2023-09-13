import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformeCuentasCobrarPagarComponent } from './informe-cuentas-cobrar-pagar.component';

const routes: Routes = [
  { path: '', component: InformeCuentasCobrarPagarComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformeCuentasCobrarPagarRoutingModule {}
