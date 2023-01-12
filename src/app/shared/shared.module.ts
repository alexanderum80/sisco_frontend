import { NavigationModule } from './../navigation/navigation.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ListItemComponent } from './ui/list-item/list-item.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditItemComponent } from './ui/add-edit-item/add-edit-item.component';
import { PrimeNgModule } from './ui/prime-ng/prime-ng.module';
import { ConciliaOperacionesDwhComponent } from './ui/concilia-operaciones-dwh/concilia-operaciones-dwh.component';

@NgModule({
  declarations: [
    ListItemComponent,
    AddEditItemComponent,
    ConciliaOperacionesDwhComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavigationModule,
    PrimeNgModule,
  ],
  exports: [
    ListItemComponent,
    AddEditItemComponent,
    ConciliaOperacionesDwhComponent,
  ],
})
export class SharedModule {}
