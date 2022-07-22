import { TooltipService } from './../tooltip/tooltip.service';
import { FormGroup } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ChangeDetectorRef,
  SimpleChanges,
} from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'png-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
})
export class MultiSelectComponent implements OnInit, OnChanges {
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
  @Input() tooltip: string = '';
  @Input() tooltipPosition: 'right' | 'left' | 'top' | 'bottom' = 'right';

  constructor(
    private cd: ChangeDetectorRef,
    private _toolTipSvc: TooltipService
  ) {}

  ngOnInit(): void {
    this.cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.disabled) {
      this.fg.controls[this.control].disable();
    }
  }

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
}
