import { UsuarioService } from './../../shared/services/usuario.service';
import SweetAlert from 'sweetalert2';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-usuario-info',
  templateUrl: './usuario-info.component.html',
  styleUrls: ['./usuario-info.component.scss']
})
export class UsuarioInfoComponent implements OnInit {

  items: MenuItem[] =  [
    { label: 'Cambiar contraseña', icon: 'mdi mdi-account-key-outline' },
    { label: 'Cerrar sesión', icon: 'mdi mdi-logout', command: () => this.logout() },
  ]

  constructor(
    private _usarioSvc: UsuarioService,
    private _authSvc: AuthenticationService,
  ) { }

  ngOnInit(): void {
  }

  logout(): void {
    try {
      this._authSvc.logout();
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: `Se produjo el siguiente error: ${ err }`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  get userName(): string {
    return this._usarioSvc.usuario.Usuario.toUpperCase();
  }

}
