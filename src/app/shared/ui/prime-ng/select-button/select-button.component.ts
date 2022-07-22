import { SelectItem } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { Component, Input } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'png-select-button',
  templateUrl: './select-button.component.html',
  styleUrls: ['./select-button.component.scss'],
})
export class SelectButtonComponent {
  @Input() public fg: FormGroup;
  @Input() public control: string;
  @Input() public label: string;
  @Input() public floatLabel = false;
  @Input() public labelWidth: string;
  @Input() public options: SelectItem[] = [];
  @Input() public required = false;
  @Input() public disabled = false;

  constructor() {}
}
