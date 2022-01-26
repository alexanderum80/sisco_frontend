import { SharedModule } from './../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoEntidadesRoutingModule } from './tipo-entidades-routing.module';
import { ListTipoEntidadesComponent } from './list-tipo-entidades/list-tipo-entidades.component';
import { TipoEntidadesFormComponent } from './tipo-entidades-form/tipo-entidades-form.component';
import { PrimeNgModule } from '../shared/ui/prime-ng/prime-ng.module';


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
    PrimeNgModule
  ]
})
export class TipoEntidadesModule { }
