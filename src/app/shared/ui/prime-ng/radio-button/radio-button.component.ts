import { SelectItem } from 'primeng/api';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'png-radio-button',
    templateUrl: './radio-button.component.html',
    styleUrls: ['./radio-button.component.scss'],
})
export class RadioButtonComponent implements OnInit {
    @Input() fg: FormGroup;
    @Input() control: string;
    @Input() items: SelectItem[] = [];
    @Input() disabled = false;

    constructor(private cd: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.cd.detectChanges();
    }
}
