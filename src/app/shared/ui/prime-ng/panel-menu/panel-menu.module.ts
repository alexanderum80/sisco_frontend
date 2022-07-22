import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelMenuModule } from 'primeng/panelmenu';

@NgModule({
  declarations: [],
  imports: [CommonModule, PanelMenuModule],
  exports: [PanelMenuModule],
})
export class PrimePanelMenuModule {}
