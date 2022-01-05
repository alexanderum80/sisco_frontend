import { cloneDeep } from 'lodash';
import { MyErrorStateMatcher } from './../models/material-error-state-matcher';
import { ISelectableOptions } from './../../shared/models/selectable-item';
import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'am-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent implements OnInit {
  @Input() public label: string;
  @Input() public fg: FormGroup;
  @Input() public control: string;
  @Input() public required = false;
  @Input() public disabled = false;
  @Input() public multiple = false;
  @Input() set values(values: ISelectableOptions[]) {
    this.originalValues = cloneDeep(values);
    this.selectionValues = this.originalValues;
  }

  originalValues: ISelectableOptions[];
  selectionValues: ISelectableOptions[];

  matcher = new MyErrorStateMatcher();

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cd.detectChanges();
  }

  get hasControlValue(): boolean {
    return this.fg.get(this.control)?.value !== '' || false;
  }

  search(event: any): void {
    const value = event.target.value.toLowerCase();

    if (!value) {
      this.selectionValues = this.originalValues;
    } else {
      this.selectionValues = this.originalValues.filter(f => f.description.toLowerCase().indexOf(value) > -1);
    }
  }

  onClear(event: Event): void {
    this.fg.controls[this.control].setValue('');
    event.stopPropagation();
  }

}
