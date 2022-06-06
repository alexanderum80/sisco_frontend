import { ActionClicked } from './../../models/list-items';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-edit-item',
  templateUrl: './add-edit-item.component.html',
  styleUrls: ['./add-edit-item.component.scss'],
})
export class AddEditItemComponent {
  @Input() fg: FormGroup;
  @Output() actionClicked = new EventEmitter<ActionClicked>();

  formGroup: FormGroup;

  constructor() {}

  save(): void {
    this.actionClicked.emit(ActionClicked.Save);
  }

  cancel(): void {
    this.actionClicked.emit(ActionClicked.Cancel);
  }
}
