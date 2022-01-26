import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpleadosRoutingModule } from './empleados-routing.module';
import { ListEmpleadosComponent } from './list-empleados/list-empleados.component';
import { EmpleadosFormComponent } from './empleados-form/empleados-form.component';
import { PrimeNgModule } from '../shared/ui/prime-ng/prime-ng.module';


@NgModule({
  declarations: [ListEmpleadosComponent, EmpleadosFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmpleadosRoutingModule,
    SharedModule,
    PrimeNgModule,
  ]
})
export class EmpleadosModule { }
