import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'png-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  @Input() public fg: FormGroup;
  @Input() public control: string;
  @Input() public label: string;
  @Input() public floatLabel = false;
  @Input() public placeholder: string;
  @Input() public labelWidth: string;
  @Input() public required = false;
  @Input() public toggleMask = false;
  @Input() public feedback = false;
  @Input() public disabled = false;

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cd.detectChanges();
  }

}
