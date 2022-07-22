import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DropdownComponent } from './dropdown.component';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [DropdownComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    TooltipModule,
  ],
  exports: [DropdownComponent, DropdownModule],
})
export class PrimeDropdownModule {}
