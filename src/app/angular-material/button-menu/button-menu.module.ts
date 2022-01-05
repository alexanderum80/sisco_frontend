import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonMenuComponent } from './button-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ButtonMenuComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
  ],
  exports: [ButtonMenuComponent]
})
export class ButtonMenuModule { }
