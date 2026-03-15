import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from './../shared/ui/prime-ng/prime-ng.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClasificadorCnmbRoutingModule } from './clasificador-cnmb-routing.module';
import { ListClasificadorCnmbComponent } from './list-clasificador-cnmb/list-clasificador-cnmb.component';
import { ClasificadorCnmbFormComponent } from './clasificador-cnmb-form/clasificador-cnmb-form.component';
import { ClasificadorCnmbService } from './shared/services/clasificador-cnmb.service';

@NgModule({
  declarations: [ListClasificadorCnmbComponent, ClasificadorCnmbFormComponent],
  imports: [
    CommonModule,
    ClasificadorCnmbRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PrimeNgModule,
  ],
  providers: [ClasificadorCnmbService],
})
export class ClasificadorCnmbModule {}
