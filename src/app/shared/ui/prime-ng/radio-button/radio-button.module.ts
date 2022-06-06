import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonComponent } from './radio-button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
  declarations: [RadioButtonComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RadioButtonModule],
  exports: [RadioButtonModule, RadioButtonComponent],
})
export class PrimeRadioButtonModule {}
