import { NavigationService } from './../../navigation/shared/services/navigation.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ChangePasswordComponent } from './../change-password/change-password.component';
import { ModalService } from './../../shared/services/modal.service';
import { Usuario } from '../../shared/models/usuarios';
import { UsuariosQueryResponse } from '../shared/models/usuarios.model';
import { AuthenticationService } from '../../shared/services/authentication.service';
import SweetAlert from 'sweetalert2';
import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { usuariosApi } from '../shared/graphql/usuarioActions.gql';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  fg: FormGroup;
  autenticando = false;

  constructor(
    private _apollo: Apollo,
    private _authSvc: AuthenticationService,
    private _route: ActivatedRoute,
    private _modalSvc: ModalService,
    private _usuarioSvc: UsuarioService,
    private _navigateSvc: NavigationService
  ) { }

  ngOnInit(): void {
    this.fg = new FormGroup({
      usuario: new FormControl(''),
      password: new FormControl(''),
    });

    this._navigateSvc.continueURL = this._route.snapshot.queryParams['continue'] || '/';
  }

  iniciar(): void {
    try {
      this.autenticando = true;

      const authVariables = {
        Usuario: this.fg.controls['usuario'].value,
        Contrasena: this.fg.controls['password'].value
      };

      this._apollo.query<UsuariosQueryResponse> ({
        query: usuariosApi.authenticate,
        variables: {
          usuario: authVariables.Usuario,
          passw: authVariables.Contrasena
        },
        fetchPolicy: 'network-only'
      }).subscribe(response => {
        this.autenticando = false;

        const result = response.data.authenticateUsuario;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'Error',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'OK'});
        }
        const usuario: Usuario = new Usuario(result.data);

        this._usuarioSvc.updateUsuarioInfo(usuario);

        if (usuario.CambiarContrasena) {
          this._usuarioSvc.fg.controls['idUsuario'].setValue(usuario.IdUsuario);
          this._usuarioSvc.fg.controls['usuario'].setValue(usuario.Usuario);
          this._usuarioSvc.fg.controls['contrasena'].setValue('');
          this._usuarioSvc.fg.controls['contrasenaConfirm'].setValue('');

          this._modalSvc.openModal(ChangePasswordComponent);
        } else {
          this._authSvc.login();

          this._navigateSvc.navigateTo(this._navigateSvc.continueURL);
        }
      });
    } catch (err: any) {
      this.autenticando = false;
      Swal.fire({
        title: 'ERROR',
        text: err,
        confirmButtonText: 'Aceptar'
      })
    }
  }

  isFormValid(): boolean {
    return this.fg.controls['usuario'].value !== '' && this.fg.controls['password'].value !== '';
  }


}
