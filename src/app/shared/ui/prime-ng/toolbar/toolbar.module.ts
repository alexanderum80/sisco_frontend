import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ToolbarModule
  ],
  exports: [ToolbarModule]
})
export class PrimeToolbarModule { }
