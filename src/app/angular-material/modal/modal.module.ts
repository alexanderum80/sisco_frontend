import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ModalComponent } from './modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ModalComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule
  ],
  exports: [ModalComponent]
})
export class ModalModule { }
