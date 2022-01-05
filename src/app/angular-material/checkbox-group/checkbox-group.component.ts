import { ICheckBoxGroup } from './checkbox-group.model';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'am-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss']
})
export class CheckboxGroupComponent implements OnInit {
  @Input() fg: FormGroup;
  @Input() checkboxValues: ICheckBoxGroup[] = [];

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cd.detectChanges();
  }

  onChange(event: any): void {
    if (!event.checked) {
      const control = this.checkboxValues[event.source.id].control;
      this.fg.controls[control].setValue(false);
    } else {
      for (let index = 0; index < this.checkboxValues.length; index++) {
        const control = this.checkboxValues[index].control;
        this.fg.controls[control].setValue(index === event.source.id ? event.checked : !event.checked);
      }
    }
  }

}
