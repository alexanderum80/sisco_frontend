import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideMenuComponent } from './slide-menu.component';
import { SlideMenuModule } from 'primeng/slidemenu';
import { PrimeButtonModule } from '../button/button.module';

@NgModule({
  declarations: [SlideMenuComponent],
  imports: [CommonModule, SlideMenuModule, PrimeButtonModule],
  exports: [SlideMenuModule, SlideMenuComponent],
})
export class PrimeSlideMenuModule {}
