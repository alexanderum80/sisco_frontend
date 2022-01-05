import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'am-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent implements OnInit {
  @Input() public label: string;
  @Input() public fg: FormGroup;
  @Input() public control: string;
  @Input() public placeholder: string;
  @Input() public required = false;
  @Input() public disabled = false;
  @Input() public rows = 1;

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cd.detectChanges();
  }

}
