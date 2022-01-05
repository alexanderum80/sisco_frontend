import { SelectModule } from './../angular-material/select/select.module';
import { TableModule } from './../angular-material/table/table.module';
import { SharedModule } from './../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClasificadorEntidadesRoutingModule } from './clasificador-entidades-routing.module';
import { ListClasificadorEntidadesComponent } from './list-clasificador-entidades/list-clasificador-entidades.component';
import { ClasificadorEntidadesFormComponent } from './clasificador-entidades-form/clasificador-entidades-form.component';
import { ModalModule } from '../angular-material/modal/modal.module';


@NgModule({
  declarations: [
    ListClasificadorEntidadesComponent,
    ClasificadorEntidadesFormComponent
  ],
  imports: [
    CommonModule,
    ClasificadorEntidadesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule,
    TableModule,
    SelectModule
  ]
})
export class ClasificadorEntidadesModule { }
