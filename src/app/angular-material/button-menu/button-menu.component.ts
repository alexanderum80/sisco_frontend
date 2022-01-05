import { ISelectableOptions } from './../../shared/models/selectable-item';
import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'am-button-menu',
  templateUrl: './button-menu.component.html',
  styleUrls: ['./button-menu.component.scss']
})
export class ButtonMenuComponent implements OnInit {
  @Input() label: string;
  @Input() type: 'button' | 'raised-button' | 'flat-button' | 'stroked-button' | 'icon-button' | 'fab' | 'mini-fab' = 'button';
  @Input() color: 'default' | 'primary' | 'accent' | 'warn' = 'default';
  @Input() disabled = false;
  @Input() menuValues: ISelectableOptions[] = [];

  @Output() clicked = new EventEmitter();

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cd.detectChanges();
  }

  onClick(event: any): void {
    this.clicked.emit(event);
  }

}
