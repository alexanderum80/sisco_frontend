import { ISelectableOptions } from './../../shared/models/selectable-item';
import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'am-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss']
})
export class RadioButtonComponent implements OnInit {
  @Input() label: string;
  @Input() fg: FormGroup;
  @Input() control: string;
  @Input() buttonValues: ISelectableOptions[];
  @Input() orientation = 'column';
  @Input() color: ThemePalette = 'primary';

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cd.detectChanges();
  }

}
