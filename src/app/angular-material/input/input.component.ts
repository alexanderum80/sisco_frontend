import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from './../models/material-error-state-matcher';
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';

type InputTypes = 'color' | 'date' | 'datetime-local' | 'email' | 'month' | 'number' | 'password' |
                'search' | 'tel' | 'text' | 'time' | 'url' | 'week';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'am-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  @Input() public type: InputTypes = 'text';
  @Input() public label: string;
  @Input() public fg: FormGroup;
  @Input() public control: string;
  @Input() public placeholder: string;
  @Input() public required = false;
  @Input() public autocomplete: 'off' | 'on' = 'on';
  @Input() set disabled(d: boolean) {
    d ? this.fg.get(this.control)?.disable() : this.fg.get(this.control)?.enable();
  }

  matcher = new MyErrorStateMatcher();

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cd.detectChanges();
  }

}
