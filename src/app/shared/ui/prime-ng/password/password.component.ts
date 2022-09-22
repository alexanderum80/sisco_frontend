import { TooltipService } from './../tooltip/tooltip.service';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'png-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit {
    @Input() public fg: FormGroup;
    @Input() public control: string;
    @Input() public label: string;
    @Input() public floatLabel = false;
    @Input() public placeholder: string;
    @Input() public labelWidth: string;
    @Input() public required = false;
    @Input() public toggleMask = false;
    @Input() public feedback = false;
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
