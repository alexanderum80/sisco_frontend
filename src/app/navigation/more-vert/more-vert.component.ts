import { UsuarioService } from './../../shared/services/usuario.service';
import { VerticalMenuItem } from './../shared/models/menu.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-more-vert',
  templateUrl: './more-vert.component.html',
  styleUrls: ['./more-vert.component.scss'],
})
export class MoreVertComponent {
  @Input() icon = 'dots-vertical';
  @Input() menuItems: VerticalMenuItem[] = [];

  @Output() OnClick = new EventEmitter<any>();

  constructor(private _usuarioSvc: UsuarioService) {}

  get isAdminPermission(): boolean {
    return this._usuarioSvc.hasAdminPermission();
  }

  onClickItem(item: any): void {
    if (!item.disabled) {
      this.OnClick.emit(item);
    }
  }
}
