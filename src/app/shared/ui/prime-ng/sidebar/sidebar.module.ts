import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';

@NgModule({
  declarations: [],
  imports: [CommonModule, SidebarModule],
  exports: [SidebarModule],
})
export class PrimeSidebarModule {}
