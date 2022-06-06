import { ListCuentasNoPermitidasComponent } from './list-cuentas-no-permitidas/list-cuentas-no-permitidas.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ListCuentasNoPermitidasComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuentasNoPermitidasRoutingModule {}
