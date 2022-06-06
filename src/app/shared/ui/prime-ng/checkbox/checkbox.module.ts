import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from './checkbox.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [CheckboxComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CheckboxModule],
  exports: [CheckboxModule, CheckboxComponent],
})
export class PrimeCheckboxModule {}
