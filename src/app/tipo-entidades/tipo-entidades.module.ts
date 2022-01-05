import { InputModule } from './../angular-material/input/input.module';
import { TableModule } from './../angular-material/table/table.module';
import { ModalModule } from './../angular-material/modal/modal.module';
import { SharedModule } from './../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoEntidadesRoutingModule } from './tipo-entidades-routing.module';
import { ListTipoEntidadesComponent } from './list-tipo-entidades/list-tipo-entidades.component';
import { TipoEntidadesFormComponent } from './tipo-entidades-form/tipo-entidades-form.component';


@NgModule({
  declarations: [
    ListTipoEntidadesComponent,
    TipoEntidadesFormComponent
  ],
  imports: [
    CommonModule,
    TipoEntidadesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule,
    TableModule,
    InputModule,
  ]
})
export class TipoEntidadesModule { }
