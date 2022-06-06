import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './dropdown.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DropdownComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DropdownModule],
  exports: [DropdownComponent, DropdownModule],
})
export class PrimeDropdownModule {}
