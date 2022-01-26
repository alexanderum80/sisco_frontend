import { SharedModule } from './../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConciliaInternaDwhComponent } from './concilia-interna-dwh.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConciliaInternaDwhRoutingModule } from './concilia-interna-dwh-routing.module';
import { PrimeNgModule } from '../shared/ui/prime-ng/prime-ng.module';


@NgModule({
  declarations: [ConciliaInternaDwhComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ConciliaInternaDwhRoutingModule,
    SharedModule,
    PrimeNgModule
  ],
})
export class ConciliaInternaDwhModule { }
