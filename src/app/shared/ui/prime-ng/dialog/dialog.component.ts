import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  @Input() showDialog = false;
  @Input() header: string;
  @Input() modal = true;
  @Input() maximizable = false;
  @Input() draggable = false;
  @Input() resizable = false;
  @Input() closeOnEscape = false;
  @Input() closable = false;

  constructor() {}

  ngOnInit(): void {}

  confirm(): void {}

  cancel(): void {}
}
