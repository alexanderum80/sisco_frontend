import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompararExpresionesRoutingModule } from './comparar-expresiones-routing.module';
import { ListCompararExpresionesComponent } from './list-comparar-expresiones/list-comparar-expresiones.component';
import { CompararExpresionesFormComponent } from './comparar-expresiones-form/comparar-expresiones-form.component';
import { CompararExpresionesService } from './shared/services/comparar-expresiones.service';
import { SharedModule } from '../shared/shared.module';
import { PrimeNgModule } from '../shared/ui/prime-ng/prime-ng.module';
import { ExpresionesService } from '../expresiones/shared/services/expresiones.service';

@NgModule({
  declarations: [
    ListCompararExpresionesComponent,
    CompararExpresionesFormComponent,
  ],
  imports: [
    CommonModule,
    CompararExpresionesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PrimeNgModule,
  ],
  providers: [CompararExpresionesService, ExpresionesService],
})
export class CompararExpresionesModule {}
