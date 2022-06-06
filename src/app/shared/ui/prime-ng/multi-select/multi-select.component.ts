import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'png-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
})
export class MultiSelectComponent {
  @Input() fg: FormGroup;
  @Input() control: string;
  @Input() label: string;
  @Input() floatLabel = false;
  @Input() labelWidth: string;
  @Input() placeholder: string;
  @Input() required = false;
  @Input() disabled = false;
  @Input() filter = false;
  @Input() optionsValues: SelectItem[] = [];

  constructor() {}
}
