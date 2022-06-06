import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaComponent } from './input-textarea.component';

@NgModule({
  declarations: [InputTextareaComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextareaModule,
  ],
  exports: [InputTextareaModule, InputTextareaComponent],
})
export class PrimeInputTextareaModule {}
