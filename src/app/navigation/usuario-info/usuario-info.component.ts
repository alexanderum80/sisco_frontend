import { ChangePasswordComponent } from './../../usuarios/change-password/change-password.component';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { UsuarioService } from './../../usuarios/shared/services/usuario.service';
import SweetAlert from 'sweetalert2';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-usuario-info',
  templateUrl: './usuario-info.component.html',
  styleUrls: ['./usuario-info.component.scss'],
})
export class UsuarioInfoComponent {
  items: MenuItem[] = [
    {
      label: 'Cambiar contraseña',
      icon: 'mdi mdi-account-key-outline',
      command: () => this.changePassword(),
    },
    {
      label: 'Cerrar sesión',
      icon: 'mdi mdi-logout',
      command: () => this.logout(),
    },
  ];

  constructor(
    private _authSvc: AuthenticationService,
    private _usuarioSvc: UsuarioService,
    private _dinamicDialogSvc: DinamicDialogService
  ) {}

  changePassword(): void {
    try {
      this._usuarioSvc.fg.controls['idUsuario'].setValue(
        this._authSvc.usuario.IdUsuario
      );
      this._usuarioSvc.fg.controls['usuario'].setValue(
        this._authSvc.usuario.Usuario
      );
      this._usuarioSvc.fg.controls['contrasena'].setValue('');
      this._usuarioSvc.fg.controls['contrasenaConfirm'].setValue('');

      this._dinamicDialogSvc.open(
        'Cambiar Contraseña',
        ChangePasswordComponent
      );
    } catch (err) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: `Se produjo el siguiente error: ${err}`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  logout(): void {
    try {
      this._authSvc.logout();
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: `Se produjo el siguiente error: ${err}`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  get userName(): string {
    return this._authSvc.usuario.Usuario.toUpperCase();
  }
}
