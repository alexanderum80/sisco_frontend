import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonComponent } from './button.component';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ButtonComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTooltipModule
  ],
  exports: [MatButtonModule, ButtonComponent]
})
export class ButtonModule { }
