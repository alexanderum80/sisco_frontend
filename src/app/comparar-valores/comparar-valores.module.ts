import { ExpresionesService } from './../expresiones/shared/services/expresiones.service';
import { CompararValoresService } from './shared/services/comparar-valores.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompararValoresRoutingModule } from './comparar-valores-routing.module';
import { ListCompararValoresComponent } from './list-comparar-valores/list-comparar-valores.component';
import { CompararValoresFormComponent } from './comparar-valores-form/comparar-valores-form.component';
import { PrimeNgModule } from '../shared/ui/prime-ng/prime-ng.module';

@NgModule({
  declarations: [ListCompararValoresComponent, CompararValoresFormComponent],
  imports: [
    CommonModule,
    CompararValoresRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    SharedModule,
  ],
  providers: [CompararValoresService, ExpresionesService],
})
export class CompararValoresModule {}
