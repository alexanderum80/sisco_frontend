import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CuentasNoPermitidasService } from './shared/services/cuentas-no-permitidas.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuentasNoPermitidasRoutingModule } from './cuentas-no-permitidas-routing.module';
import { ListCuentasNoPermitidasComponent } from './list-cuentas-no-permitidas/list-cuentas-no-permitidas.component';
import { CuentasNoPermitidasFormComponent } from './cuentas-no-permitidas-form/cuentas-no-permitidas-form.component';
import { SharedModule } from '../shared/shared.module';
import { PrimeNgModule } from '../shared/ui/prime-ng/prime-ng.module';


@NgModule({
  declarations: [
    ListCuentasNoPermitidasComponent,
    CuentasNoPermitidasFormComponent,
  ],
  imports: [
    CommonModule,
    CuentasNoPermitidasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PrimeNgModule
  ],
  providers: [
    CuentasNoPermitidasService
  ]
})
export class CuentasNoPermitidasModule { }
