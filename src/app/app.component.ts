import { AuthenticationService } from './shared/services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { cloneDeep } from '@apollo/client/utilities';
import { MenuItems } from './navigation/shared/models/menu-items';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  menu: MenuItem[] = cloneDeep(MenuItems);

  authenticated: boolean;

  constructor(
    private _authSvc: AuthenticationService
  ) {}

  ngOnInit(): void {
    this._authSvc.authenticated$.subscribe(auth => {
      this.authenticated = auth;
    });
  }
}
