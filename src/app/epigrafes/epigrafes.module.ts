import { SharedModule } from './../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EpigrafesRoutingModule } from './epigrafes-routing.module';
import { ListEpigrafesComponent } from './list-epigrafes/list-epigrafes.component';
import { EpigrafesFormComponent } from './epigrafes-form/epigrafes-form.component';
import { PrimeNgModule } from '../shared/ui/prime-ng/prime-ng.module';


@NgModule({
  declarations: [
    ListEpigrafesComponent,
    EpigrafesFormComponent
  ],
  imports: [
    CommonModule,
    EpigrafesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PrimeNgModule
  ]
})
export class EpigrafesModule { }
