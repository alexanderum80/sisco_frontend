import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectButtonComponent } from './select-button.component';
import { SelectButtonModule } from 'primeng/selectbutton';

@NgModule({
  declarations: [SelectButtonComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectButtonModule],
  exports: [SelectButtonModule, SelectButtonComponent],
})
export class PrimeSelectButtonModule {}
