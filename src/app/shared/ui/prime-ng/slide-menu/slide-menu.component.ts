import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'png-slide-menu',
  templateUrl: './slide-menu.component.html',
  styleUrls: ['./slide-menu.component.scss'],
})
export class SlideMenuComponent implements OnInit {
  @Input() items: MenuItem[];
  @Input() popup = true;
  @Input() label: string;
  @Input() icon: 'mdi mdi-dots-vertical';
  @Input() height = 120;

  constructor() {}

  ngOnInit(): void {}
}
