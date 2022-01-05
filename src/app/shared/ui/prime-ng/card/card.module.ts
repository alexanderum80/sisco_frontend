import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { CardComponent } from './card.component';

@NgModule({
  declarations: [
    CardComponent
  ],
  imports: [
    CommonModule,
    CardModule,
  ],
  exports: [
    CardModule,
    CardComponent
  ]
})
export class PrimeCardModule { }
