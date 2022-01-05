import { ThemePalette } from '@angular/material/core';
import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'am-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
  @Input() fg: FormGroup;
  @Input() control: string;
  @Input() label: string;
  @Input() labelPosition: 'before' | 'after' = 'before';
  @Input() disabled = false;
  @Input() required = false;
  @Input() color: ThemePalette = 'primary';
  @Input() tooltip = '';

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cd.detectChanges();
  }

  get indeterminateValue(): boolean {
    return this.fg.get(this.control)?.value === '';
  }

}
