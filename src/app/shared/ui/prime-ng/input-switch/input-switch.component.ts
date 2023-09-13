import { TooltipService } from './../tooltip/tooltip.service';
import {
  Component,
  Input,
  ChangeDetectorRef,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'png-input-switch',
  templateUrl: './input-switch.component.html',
  styleUrls: ['./input-switch.component.scss'],
})
export class InputSwitchComponent implements OnInit, OnChanges {
  @Input() public fg: FormGroup;
  @Input() public control: string;
  @Input() public label: string;
  @Input() public floatLabel = false;
  @Input() public labelWidth: string;
  @Input() public required = false;
  @Input() public disabled = false;
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
    if (this.disabled) this.fg.controls[this.control].disable();
    else this.fg.controls[this.control].enable();
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
