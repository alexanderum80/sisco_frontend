import { SharedModule } from './../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClasificadorEntidadesRoutingModule } from './clasificador-entidades-routing.module';
import { ListClasificadorEntidadesComponent } from './list-clasificador-entidades/list-clasificador-entidades.component';
import { ClasificadorEntidadesFormComponent } from './clasificador-entidades-form/clasificador-entidades-form.component';
import { PrimeNgModule } from '../shared/ui/prime-ng/prime-ng.module';

@NgModule({
  declarations: [
    ListClasificadorEntidadesComponent,
    ClasificadorEntidadesFormComponent,
  ],
  imports: [
    CommonModule,
    ClasificadorEntidadesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PrimeNgModule,
  ],
})
export class ClasificadorEntidadesModule {}
