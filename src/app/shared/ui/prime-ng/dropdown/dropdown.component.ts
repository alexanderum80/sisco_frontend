import { TooltipService } from './../tooltip/tooltip.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'png-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent {
  @Input() fg: FormGroup;
  @Input() control: string;
  @Input() label: string;
  @Input() floatLabel = false;
  @Input() labelWidth: string;
  @Input() placeholder: string;
  @Input() required = false;
  @Input() disabled = false;
  @Input() filter = true;
  @Input() showClear = true;
  @Input() isLoading = false;
  @Input() optionsValues: SelectItem[] = [];
  @Input() tooltip: string = '';
  @Input() tooltipPosition: 'right' | 'left' | 'top' | 'bottom' = 'right';

  @Output() fgChange = new EventEmitter<any>();

  constructor(
    // private cd: ChangeDetectorRef,
    private _toolTipSvc: TooltipService
  ) {}

  getToolTip(): string {
    return this._toolTipSvc.getFormControlTooltip(
      this.fg.controls[this.control],
      this.tooltip
    );
  }

  getToolTipStyleClass(): string {
    return this._toolTipSvc.getToolTipStyleClass(
      this.fg.controls[this.control]
    );
  }

  onChange(event: any) {
    this.fgChange.emit({
      control: this.control,
      value: event.value,
    });
  }
}
