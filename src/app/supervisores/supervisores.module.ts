import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupervisoresRoutingModule } from './supervisores-routing.module';
import { ListSupervisoresComponent } from './list-supervisores/list-supervisores.component';
import { SupervisoresFormComponent } from './supervisores-form/supervisores-form.component';
import { PrimeNgModule } from '../shared/ui/prime-ng/prime-ng.module';

@NgModule({
  declarations: [ListSupervisoresComponent, SupervisoresFormComponent],
  imports: [
    CommonModule,
    SupervisoresRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PrimeNgModule,
  ],
})
export class SupervisoresModule {}
