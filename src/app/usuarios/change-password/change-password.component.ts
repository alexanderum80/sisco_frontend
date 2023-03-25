import { UsuarioService } from './../shared/services/usuario.service';
import { ActionClicked } from './../../shared/models/list-items';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { NavigationService } from './../../navigation/shared/services/navigation.service';
import { UsuariosMutationResponse } from './../shared/models/usuarios.model';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { toNumber } from 'lodash';
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
    private _apollo: Apollo,
    private _navigationSvc: NavigationService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _usuarioSvc: UsuarioService
  ) {}

  ngOnInit(): void {
    this.fg = this._usuarioSvc.fg;
  }

  ngOnDestroy(): void {
    this.subscription.map(subs => {
      subs.unsubscribe();
    });
  }

  onActionClicked(action: ActionClicked) {
    switch (action) {
      case ActionClicked.Save:
        this._save();
        break;
      case ActionClicked.Cancel:
        this._closeModal();
        break;
    }
  }

  private _save(): void {
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
        .subscribe(res => {
          const result = res.data?.changePassword;

          if (!result?.success) {
            return SweetAlert.fire({
              icon: 'error',
              title: 'ERROR',
              text: result?.error,
              showConfirmButton: true,
              confirmButtonText: 'Aceptar',
            });
          }

          this._dinamicDialogSvc.close();

          this._navigationSvc.navigateTo(this._navigationSvc.continueURL);
        })
    );
  }

  private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }
}
