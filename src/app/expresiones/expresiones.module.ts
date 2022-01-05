import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpresionesRoutingModule } from './expresiones-routing.module';
import { ListExpresionesComponent } from './list-expresiones/list-expresiones.component';
import { ExpresionesFormComponent } from './expresiones-form/expresiones-form.component';
import { ExpresionesService } from './shared/services/expresiones.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../shared/ui/prime-ng/prime-ng.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ListExpresionesComponent,
    ExpresionesFormComponent,
  ],
  imports: [
    CommonModule,
    ExpresionesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PrimeNgModule
  ],
  providers: [
    ExpresionesService
  ]
})
export class ExpresionesModule { }
