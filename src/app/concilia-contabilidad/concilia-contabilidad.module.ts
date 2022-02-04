import { ConciliaContabilidadService } from './shared/services/concilia-contabilidad.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConciliaContabilidadRoutingModule } from './concilia-contabilidad-routing.module';
import { ConciliaContabilidadComponent } from './concilia-contabilidad.component';
import { PrimeNgModule } from '../shared/ui/prime-ng/prime-ng.module';


@NgModule({
  declarations: [
    ConciliaContabilidadComponent
  ],
  imports: [
    CommonModule,
    ConciliaContabilidadRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PrimeNgModule,
  ],
  providers: [
    ConciliaContabilidadService
  ]
})
export class ConciliaContabilidadModule { }
