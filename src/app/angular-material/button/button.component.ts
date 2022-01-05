import { Component, Input, OnInit, Output, EventEmitter, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'am-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() label: string;
  @Input() type: 'button' | 'raised-button' | 'flat-button' | 'stroked-button' | 'icon-button' | 'fab' | 'mini-fab' = 'button';
  @Input() color: 'default' | 'primary' | 'accent' | 'warn' = 'default';
  @Input() disabled = false;
  @Input() icon: string;
  @Input() toolTip = '';

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
