import { ThemePalette } from '@angular/material/core';

export interface ICheckBoxGroup {
    control: string;
    label: string;
    labelPosition: 'before' | 'after';
    checked: boolean;
    disabled: boolean;
    color: ThemePalette;
    tooltip: string;
}
