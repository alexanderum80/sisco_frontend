import { PrimeToolbarModule } from './../toolbar/toolbar.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { PrimeSlideMenuModule } from '../slide-menu/slide-menu.module';
import { MenuModule } from 'primeng/menu';
import { TableService } from './table.service';

@NgModule({
  declarations: [TableComponent],
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    CalendarModule,
    PrimeSlideMenuModule,
    MenuModule,
    PrimeToolbarModule,
  ],
  providers: [TableService],
  exports: [TableModule, TableComponent],
})
export class PrimeTableModule {}
