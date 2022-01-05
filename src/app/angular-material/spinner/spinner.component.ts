import { Component, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'am-spinner',
  styleUrls: ['./spinner.component.scss'],
  template: `
  <div class="spinner-container">
    <div class="spinner">
      <mat-spinner></mat-spinner>
    </div>
  </div>
  `
})
export class SpinnerComponent { }
