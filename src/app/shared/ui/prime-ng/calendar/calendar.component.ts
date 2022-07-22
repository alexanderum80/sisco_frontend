import { TooltipService } from './../tooltip/tooltip.service';
import {
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'png-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit, OnChanges {
    @Input() fg: FormGroup;
    @Input() label: string;
    @Input() floatLabel = false;
    @Input() labelWidth: string;
    @Input() control: string;
    @Input() view: 'date' | 'month' | 'year' = 'date';
    @Input() dateFormat = 'dd/mm/yy';
    @Input() showIcon = true;
    @Input() minDate: Date;
    @Input() maxDate: Date;
    @Input() readonlyInput = true;
    @Input() disabledDays: number[] = [];
    @Input() monthNavigator = true;
    @Input() yearNavigator = true;
    @Input() yearRange: string =
        new Date().getFullYear() - 10 + ':' + new Date().getFullYear();
    @Input() showTime = false;
    @Input() timeOnly = false;
    @Input() selectionMode: 'single' | 'multiple' | 'range' = 'single';
    @Input() showButtonBar = true;
    @Input() required = false;
    @Input() disabled = false;
    @Input() tooltip: string;
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
