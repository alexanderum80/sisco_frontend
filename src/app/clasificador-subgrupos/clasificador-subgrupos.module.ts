import { ClasificadorSubgruposService } from './shared/services/clasificador-subgrupos.service';
import { PrimeNgModule } from './../shared/ui/prime-ng/prime-ng.module';
import { SharedModule } from './../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClasificadorSubgruposFormComponent } from './clasificador-subgrupos-form/clasificador-subgrupos-form.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClasificadorSubgruposRoutingModule } from './clasificador-subgrupos-routing.module';
import { ListClasificadorSubgruposComponent } from './list-clasificador-subgrupos/list-clasificador-subgrupos.component';

@NgModule({
  declarations: [
    ListClasificadorSubgruposComponent,
    ClasificadorSubgruposFormComponent,
  ],
  imports: [
    CommonModule,
    ClasificadorSubgruposRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PrimeNgModule,
  ],
  providers: [ClasificadorSubgruposService],
})
export class ClasificadorSubgruposModule {}
