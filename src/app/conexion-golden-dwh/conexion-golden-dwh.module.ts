import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from './../shared/shared.module';
import { ConexionGoldenDwhRoutingModule } from './conexion-golden-dwh-routing.module';
import { ConexionGoldenDwhFormComponent } from './conexion-golden-dwh-form/conexion-golden-dwh-form.component';
import { ConexionGoldenDwhComponent } from './conexion-golden-dwh.component';
import { AngularMaterialComponentsModule } from './../angular-material/angular-material.module';
import { ConexionGoldenDwhService } from './shared/services/conexion-golden-dwh.service';
import { PrimeNgModule } from '../shared/ui/prime-ng/prime-ng.module';


@NgModule({
  declarations: [ConexionGoldenDwhFormComponent, ConexionGoldenDwhComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ConexionGoldenDwhRoutingModule,
    AngularMaterialComponentsModule,
    SharedModule,
    PrimeNgModule
  ],
})
export class ConexionGoldenDwhModule { }
