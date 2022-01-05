import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularMaterialComponentsModule } from '../angular-material/angular-material.module';
import { ParteAtrasoRoutingModule } from './parte-atraso-routing.module';
import { ParteAtrasoComponent } from './parte-atraso.component';
import { ParteAtrasoService } from './shared/services/parte-atraso.service';
import { PrimeNgModule } from '../shared/ui/prime-ng/prime-ng.module';


@NgModule({
  declarations: [ParteAtrasoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ParteAtrasoRoutingModule,
    AngularMaterialComponentsModule,
    SharedModule,
    PrimeNgModule
  ],
  providers: [ParteAtrasoService]
})
export class ParteAtrasoModule { }
