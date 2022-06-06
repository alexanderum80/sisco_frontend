import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElementosGastosRoutingModule } from './elementos-gastos-routing.module';
import { ListElementosGastosComponent } from './list-elementos-gastos/list-elementos-gastos.component';
import { ElementosGastosFormComponent } from './elementos-gastos-form/elementos-gastos-form.component';
import { PrimeNgModule } from '../shared/ui/prime-ng/prime-ng.module';
import { ElementosGastosService } from './shared/services/elementos-gastos.service';

@NgModule({
  declarations: [ListElementosGastosComponent, ElementosGastosFormComponent],
  imports: [
    CommonModule,
    ElementosGastosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PrimeNgModule,
  ],
  providers: [ElementosGastosService],
})
export class ElementosGastosModule {}
