import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClasificadorCuentaRoutingModule } from './clasificador-cuenta-routing.module';
import { ListClasificadorCuentaComponent } from './list-clasificador-cuenta/list-clasificador-cuenta.component';
import { ClasificadorCuentaFormComponent } from './clasificador-cuenta-form/clasificador-cuenta-form.component';
import { PrimeNgModule } from '../shared/ui/prime-ng/prime-ng.module';
import { ClasificadorCuentaService } from './shared/service/clasificador-cuenta.service';

@NgModule({
  declarations: [
    ListClasificadorCuentaComponent,
    ClasificadorCuentaFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClasificadorCuentaRoutingModule,
    SharedModule,
    PrimeNgModule,
  ],
  providers: [ClasificadorCuentaService],
})
export class ClasificadorCuentaModule {}
