import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'png-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() label: string;
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

  @Output() clicked = new EventEmitter();

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cd.detectChanges();
  }

  onClicked(event: Event): void {
    this.clicked.emit(event);
  }

  get iconType(): string {
    return this.icon || this.loading ? `pi ${this.icon}` : '';
  }
}
