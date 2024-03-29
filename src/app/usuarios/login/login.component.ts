import { SweetalertService } from './../../shared/helpers/sweetalert.service';
import { NavigationService } from './../../navigation/shared/services/navigation.service';
import { UsuarioService } from 'src/app/usuarios/shared/services/usuario.service';
import { ChangePasswordComponent } from './../change-password/change-password.component';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  fg: FormGroup;
  autenticando = false;

  constructor(
    private _authSvc: AuthenticationService,
    private _route: ActivatedRoute,
    private _dinamicDialogSvc: DinamicDialogService,
    private _usuarioSvc: UsuarioService,
    private _navigateSvc: NavigationService,
    private _swalSvc: SweetalertService
  ) {}

  ngOnInit(): void {
    this.fg = new FormGroup({
      usuario: new FormControl(''),
      password: new FormControl(''),
      sesionAbierta: new FormControl(false),
    });

    this._navigateSvc.continueURL =
      this._route.snapshot.queryParams['continue'] || '/';
  }

  iniciar(): void {
    try {
      this.autenticando = true;

      const authVariables = {
        Usuario: this.fg.controls['usuario'].value.toLowerCase(),
        Contrasena: this.fg.controls['password'].value,
      };

      this._authSvc.login(authVariables).subscribe({
        next: res => {
          this.autenticando = false;

          const usuario = res.authenticateUsuario;

          // if (this.fg.get('sesionAbierta')?.value)
          //   localStorage.setItem('usuario', JSON.stringify(usuario));

          if (usuario.CambiarContrasena) {
            this._usuarioSvc.fg.controls['idUsuario'].setValue(
              usuario.IdUsuario
            );
            this._usuarioSvc.fg.controls['usuario'].setValue(usuario.Usuario);
            this._usuarioSvc.fg.controls['contrasena'].setValue('');
            this._usuarioSvc.fg.controls['contrasenaConfirm'].setValue('');

            this._dinamicDialogSvc.open(
              'Cambiar Contraseña',
              ChangePasswordComponent
            );
          } else {
            this._navigateSvc.navigateTo(this._navigateSvc.continueURL);
          }
        },
        error: err => {
          this.autenticando = false;
          this._swalSvc.error(err);
        },
      });
    } catch (err: any) {
      this.autenticando = false;
      this._swalSvc.error(err);
    }
  }

  isFormValid(): boolean {
    return (
      this.fg.controls['usuario'].value !== '' &&
      this.fg.controls['password'].value !== ''
    );
  }
}
