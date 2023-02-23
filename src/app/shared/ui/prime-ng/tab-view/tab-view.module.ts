import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabView, TabViewModule } from 'primeng/tabview';

@NgModule({
  declarations: [],
  imports: [CommonModule, TabViewModule],
  exports: [TabViewModule],
  providers: [TabView],
})
export class PrimeTabViewModule {}
