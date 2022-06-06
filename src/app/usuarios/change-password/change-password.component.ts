import { AuthenticationService } from './../../shared/services/authentication.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { NavigationService } from './../../navigation/shared/services/navigation.service';
import { UsuariosMutationResponse } from './../shared/models/usuarios.model';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { toNumber } from 'lodash';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import SweetAlert from 'sweetalert2';
import { usuariosApi } from '../shared/graphql/usuarioActions.gql';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  fg: FormGroup;

  subscription: Subscription[] = [];

  constructor(
    private _usuarioSvc: UsuarioService,
    private _apollo: Apollo,
    private _navigationSvc: NavigationService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _authSvc: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.fg = this._usuarioSvc.fg;
  }

  ngOnDestroy(): void {
    this.subscription.map(subs => {
      subs.unsubscribe();
    });
  }

  changePassword(): void {
    if (
      this.fg.controls['contrasena'].value !==
      this.fg.controls['contrasenaConfirm'].value
    ) {
      SweetAlert.fire({
        icon: 'error',
        title: 'Error al Validar',
        text: 'Las contraseñas introducidas no coinciden. Rectifique.',
        showConfirmButton: true,
        confirmButtonText: 'OK',
      });
      return;
    }

    const _idUsuario = toNumber(this.fg.controls['idUsuario'].value);
    const _password = this.fg.controls['contrasena'].value;

    this.subscription.push(
      this._apollo
        .mutate<UsuariosMutationResponse>({
          mutation: usuariosApi.changePassword,
          variables: { idUsuario: _idUsuario, password: _password },
        })
        .subscribe(response => {
          const result = response.data?.changePassword;

          if (!result?.success) {
            return SweetAlert.fire({
              icon: 'error',
              title: 'ERROR',
              text: result?.error,
              showConfirmButton: true,
              confirmButtonText: 'Aceptar',
            });
          }

          this._authSvc.login();

          this._dinamicDialogSvc.close();

          this._navigationSvc.navigateTo(this._navigationSvc.continueURL);
        })
    );
  }
}
