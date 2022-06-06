import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerComponent } from './progress-spinner.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  declarations: [ProgressSpinnerComponent],
  imports: [CommonModule, ProgressSpinnerModule],
  exports: [ProgressSpinnerModule, ProgressSpinnerComponent],
})
export class PrimeProgressSpinnerModule {}
