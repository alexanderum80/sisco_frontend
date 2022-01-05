import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';
import { ButtonModule } from 'primeng/button';
import { PrimeTooltipModule } from '../tooltip/tooltip.module';

@NgModule({
  declarations: [
    ButtonComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    PrimeTooltipModule,
  ],
  exports: [
    ButtonModule,
    ButtonComponent
  ]
})
export class PrimeButtonModule { }
