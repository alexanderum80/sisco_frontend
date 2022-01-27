import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationModule } from './../navigation/navigation.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ListItemComponent } from './ui/list-item/list-item.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditItemComponent } from './ui/add-edit-item/add-edit-item.component';
import { CloseButtonComponent } from './ui/close-button/close-button.component';
import { PrimeNgModule } from './ui/prime-ng/prime-ng.module';

@NgModule({
  declarations: [
    ListItemComponent,
    AddEditItemComponent,
    CloseButtonComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavigationModule,
    MatTooltipModule,
    PrimeNgModule
  ],
  exports: [
    ListItemComponent,
    AddEditItemComponent,
    CloseButtonComponent,
  ]
})
export class SharedModule { }
