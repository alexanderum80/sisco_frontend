import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClasificadorCuentaRoutingModule } from './clasificador-cuenta-routing.module';
import { ListClasificadorCuentaComponent } from './list-clasificador-cuenta/list-clasificador-cuenta.component';
import { ClasificadorCuentaFormComponent } from './clasificador-cuenta-form/clasificador-cuenta-form.component';
import { AngularMaterialComponentsModule } from '../angular-material/angular-material.module';


@NgModule({
  declarations: [
    ListClasificadorCuentaComponent,
    ClasificadorCuentaFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClasificadorCuentaRoutingModule,
    SharedModule,
    AngularMaterialComponentsModule
  ]
})
export class ClasificadorCuentaModule { }
