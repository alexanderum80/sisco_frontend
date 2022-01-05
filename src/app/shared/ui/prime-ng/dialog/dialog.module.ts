import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import {DialogModule} from 'primeng/dialog';

@NgModule({
  declarations: [
    DialogComponent
  ],
  imports: [
    CommonModule,
    DialogModule
  ],
  exports: [
    DialogModule,
    DialogComponent
  ]
})
export class PrimeDialogModule { }
