import { SelectModule } from './../angular-material/select/select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputModule } from './../angular-material/input/input.module';
import { TableModule } from './../angular-material/table/table.module';
import { SharedModule } from './../shared/shared.module';
import { ModalModule } from './../angular-material/modal/modal.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElementosGastosRoutingModule } from './elementos-gastos-routing.module';
import { ListElementosGastosComponent } from './list-elementos-gastos/list-elementos-gastos.component';
import { ElementosGastosFormComponent } from './elementos-gastos-form/elementos-gastos-form.component';


@NgModule({
  declarations: [
    ListElementosGastosComponent,
    ElementosGastosFormComponent,
  ],
  imports: [
    CommonModule,
    ElementosGastosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    InputModule,
    SelectModule,
    ModalModule,
    SharedModule
  ]
})
export class ElementosGastosModule { }
