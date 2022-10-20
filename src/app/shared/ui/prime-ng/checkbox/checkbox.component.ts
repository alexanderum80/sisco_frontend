import {
    AfterContentChecked,
    ChangeDetectorRef,
    Component,
    Input,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'png-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent implements AfterContentChecked {
    @Input() fg: FormGroup;
    @Input() control: string;
    @Input() label: string;
    @Input() public labelPosition: 'left' | 'right' = 'right';
    @Input() defaultValue = false;
    @Input() disabled = false;

    constructor(private cd: ChangeDetectorRef) {}

    ngAfterContentChecked(): void {
        this.cd.detectChanges();
    }
}
