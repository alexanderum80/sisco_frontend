import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DinamicDialogService } from './dinamic-dialog.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DynamicDialogModule
  ],
  providers: [
    DialogService,
    DinamicDialogService
  ],
  exports: [
    DynamicDialogModule,
  ]
})
export class PrimeDinamicDialogModule { }
