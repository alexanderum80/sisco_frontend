import { AuthenticationService } from './../../shared/services/authentication.service';
import { VerticalMenuItem } from './../shared/models/menu.model';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-more-vert',
  templateUrl: './more-vert.component.html',
  styleUrls: ['./more-vert.component.scss'],
})
export class MoreVertComponent {
  @Input() icon = 'dots-vertical';
  @Input() menuItems: VerticalMenuItem[] = [];

  @Output() OnClick = new EventEmitter<any>();

  constructor(private _authSvc: AuthenticationService) {}

  get isAdminPermission(): boolean {
    return this._authSvc.hasAdminPermission();
  }

  onClickItem(item: any): void {
    if (!item.disabled) {
      this.OnClick.emit(item);
    }
  }
}
