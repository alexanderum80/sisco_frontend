import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplitButtonComponent } from './split-button.component';
import { SplitButtonModule } from 'primeng/splitbutton';

@NgModule({
  declarations: [SplitButtonComponent],
  imports: [CommonModule, SplitButtonModule],
  exports: [SplitButtonModule, SplitButtonComponent],
})
export class PrimeSplitButtonModule {}
