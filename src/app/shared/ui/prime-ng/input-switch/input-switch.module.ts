import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputSwitchComponent } from './input-switch.component';

@NgModule({
  declarations: [InputSwitchComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputSwitchModule,
    TooltipModule,
  ],
  exports: [InputSwitchModule, InputSwitchComponent],
})
export class PrimeInputSwitchModule {}
