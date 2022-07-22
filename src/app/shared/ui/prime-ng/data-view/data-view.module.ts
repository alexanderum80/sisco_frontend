import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewComponent } from './data-view.component';
import { DataViewModule } from 'primeng/dataview';

@NgModule({
  declarations: [DataViewComponent],
  imports: [CommonModule, DataViewModule],
  exports: [DataViewModule, DataViewComponent],
})
export class PrimeDataViewModule {}
