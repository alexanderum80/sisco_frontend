import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'png-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
  @Input() fg: FormGroup;
  @Input() control: string;
  @Input() label: string;
  @Input() defaultValue = false;
  @Input() disabled = false;

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cd.detectChanges();
  }

}
