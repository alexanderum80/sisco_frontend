import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectComponent } from './multi-select.component';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
  declarations: [MultiSelectComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MultiSelectModule],
  exports: [MultiSelectModule, MultiSelectComponent],
})
export class PrimeMultiSelectModule {}
