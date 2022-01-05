import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelComponent } from './panel.component';
import { PanelModule } from 'primeng/panel';
import { PrimeButtonModule } from '../button/button.module';
import { PrimeTooltipModule } from '../tooltip/tooltip.module';

@NgModule({
  declarations: [
    PanelComponent
  ],
  imports: [
    CommonModule,
    PanelModule,
    PrimeButtonModule,
    PrimeTooltipModule
  ],
  exports: [
    PanelModule,
    PanelComponent
  ]
})
export class PrimePanelModule { }
