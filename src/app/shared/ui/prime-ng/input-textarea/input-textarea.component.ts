import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'png-input-textarea',
  templateUrl: './input-textarea.component.html',
  styleUrls: ['./input-textarea.component.scss']
})
export class InputTextareaComponent implements OnInit {
  @Input() public fg: FormGroup;
  @Input() public control: string;
  @Input() public label: string;
  @Input() public floatLabel = false;
  @Input() public labelWidth: string;
  @Input() public placeholder = '';
  @Input() public required = false;
  @Input() public disabled = false;
  @Input() public autocomplete: 'off' | 'on' = 'on';

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cd.detectChanges();
  }

}
