import { ExpansionPanelComponent } from './expansion-panel.component';
import { MatExpansionModule } from '@angular/material/expansion';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ExpansionPanelComponent],
  imports: [
    CommonModule,
    MatExpansionModule
  ],
  exports: [MatExpansionModule, ExpansionPanelComponent]
})
export class ExpansionPanelModule { }
