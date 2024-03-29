import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'png-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements AfterContentChecked {
  @Input() label: string;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() icon: string;
  @Input() iconPos: 'left' | 'right' = 'left';
  @Input() disabled = false;
  @Input() style:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning'
    | 'help'
    | 'danger'
    | 'link' = 'primary';
  @Input() raised = false;
  @Input() rounded = false;
  @Input() text = false;
  @Input() outlined = false;
  @Input() size: 'normal' | 'large' = 'normal';
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() tooltip: string;
  @Input() tooltipPosition: 'right' | 'left' | 'top' | 'bottom' = 'right';

  @Output() clicked = new EventEmitter();

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }

  onClicked(event: Event): void {
    this.clicked.emit(event);
  }

  get iconType(): string {
    return this.icon || this.loading ? `pi ${this.icon}` : '';
  }
}
