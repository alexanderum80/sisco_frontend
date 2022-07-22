import { TooltipModule } from 'primeng/tooltip';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputMaskComponent } from './input-mask.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';

@NgModule({
  declarations: [InputMaskComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputMaskModule,
    TooltipModule,
  ],
  exports: [InputMaskModule, InputMaskComponent],
})
export class PrimeInputMaskModule {}
