import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConexionRodasRoutingModule } from './conexion-rodas-routing.module';
import { ListConexionRodasComponent } from './list-conexion-rodas/list-conexion-rodas.component';
import { ConexionRodasFormComponent } from './conexion-rodas-form/conexion-rodas-form.component';
import { EstadoConexionRodasComponent } from './estado-conexion/estado-conexion.component';
import { PrimeNgModule } from '../shared/ui/prime-ng/prime-ng.module';
import { ConexionRodasService } from './shared/services/conexion-rodas.service';


@NgModule({
  declarations: [ListConexionRodasComponent, ConexionRodasFormComponent, EstadoConexionRodasComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ConexionRodasRoutingModule,
    SharedModule,
    PrimeNgModule
  ],
  providers: [
    ConexionRodasService
  ]
})
export class ConexionRodasModule { }
