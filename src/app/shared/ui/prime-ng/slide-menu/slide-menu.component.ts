import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'png-slide-menu',
  templateUrl: './slide-menu.component.html',
  styleUrls: ['./slide-menu.component.scss'],
})
export class SlideMenuComponent {
  @Input() items: MenuItem[];
  @Input() popup = true;
  @Input() label: string;
  @Input() icon: 'mdi mdi-dots-vertical';
  @Input() height = 120;

  constructor() {}
}
