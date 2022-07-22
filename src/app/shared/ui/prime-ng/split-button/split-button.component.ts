import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'png-split-button',
  templateUrl: './split-button.component.html',
  styleUrls: ['./split-button.component.scss'],
})
export class SplitButtonComponent implements OnInit {
  @Input() label: string;
  @Input() items: MenuItem[];
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
    | 'danger' = 'primary';

  @Output() clicked = new EventEmitter();

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cd.detectChanges();
  }

  onClicked(): void {
    this.clicked.emit();
  }
}
