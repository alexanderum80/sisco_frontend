import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputNumberComponent } from './input-number.component';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  declarations: [InputNumberComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputNumberModule,
    TooltipModule,
  ],
  exports: [InputNumberModule, InputNumberComponent],
})
export class PrimeInputNumberModule {}
