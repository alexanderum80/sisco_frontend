import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Directive } from '@angular/core';

export const FORMAT = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Directive({
    selector: '[appDateFormat]',
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: FORMAT },
    ],
})
export class DateFormatDirective {
}


export const FORMAT_MMYYYY = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'MMMM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Directive({
    selector: '[appYearMonthFormat]',
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: FORMAT_MMYYYY },
    ],
})
export class YearMonthFormatDirective {
}
