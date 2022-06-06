import { SharedModule } from './../shared/shared.module';
import { ConciliaGoldenDwhComponent } from './concilia-golden-dwh.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConciliaGoldenDwhRoutingModule } from './concilia-golden-dwh-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConciliaGoldenDwhService } from './shared/services/concilia-golden-dwh.service';
import { PrimeNgModule } from '../shared/ui/prime-ng/prime-ng.module';

@NgModule({
  declarations: [ConciliaGoldenDwhComponent],
  imports: [
    CommonModule,
    ConciliaGoldenDwhRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PrimeNgModule,
  ],
  providers: [ConciliaGoldenDwhService],
})
export class ConciliaGoldenDwhModule {}
