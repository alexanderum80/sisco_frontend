import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'png-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
})
export class InputNumberComponent implements OnInit {
  @Input() public fg: FormGroup;
  @Input() public control: string;
  @Input() public label: string;
  @Input() public floatLabel = false;
  @Input() public labelWidth: string;
  @Input() public mode: 'decimal' | 'currency' = 'currency';
  @Input() public currency = 'USD';
  @Input() public locale = 'en-US';
  @Input() public minFractionDigits = 2;
  @Input() public suffix = '';
  @Input() public prefix = '';
  @Input() public required = false;
  @Input() public disabled = false;
  @Input() public autocomplete: 'off' | 'on' = 'on';

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cd.detectChanges();
  }
}
