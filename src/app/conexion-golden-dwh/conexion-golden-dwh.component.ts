import { DinamicDialogService } from './../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { ETipoUsuarios } from './../usuarios/shared/models/usuarios.model';
import SweetAlert from 'sweetalert2';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ConexionGoldenDwhService } from './shared/services/conexion-golden-dwh.service';
import { ConexionGoldenDwhFormComponent } from './conexion-golden-dwh-form/conexion-golden-dwh-form.component';
import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../navigation/shared/services/navigation.service';

@Component({
  selector: 'app-conexion-golden-dwh',
  template: '<div></div>',
})
export class ConexionGoldenDwhComponent implements OnInit {
  constructor(
    private _usuarioSvc: UsuarioService,
    private _conexionDWHSvc: ConexionGoldenDwhService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _navigationSvc: NavigationService
  ) {}

  ngOnInit(): void {
    this._setFgValues();

    if (
      this._usuarioSvc.usuario.IdTipoUsuario === ETipoUsuarios.Administrador
    ) {
      this._dinamicDialogSvc.open(
        'Actualizar Conexión al Golden DWH',
        ConexionGoldenDwhFormComponent
      );
      this._usuarioSvc.subscription.push(
        this._dinamicDialogSvc.ref.onClose.subscribe(() =>
          this._navigationSvc.navigateTo('')
        )
      );
    } else {
      SweetAlert.fire({
        icon: 'warning',
        title: 'AVISO',
        text: 'No tiene permisos para configurar la Conexión al DWH. Contacte con el personal informático.',
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });

      this._navigationSvc.navigateTo('');
    }
  }

  private _setFgValues(): void {
    const fgValues = {
      idUnidad: null,
      dwh_ip: '',
      dwh_usuario: '',
      dwh_contrasena: '',
      dwh_baseDatos: null,
      rest_ip: '',
      rest_usuario: '',
      rest_contrasena: '',
      rest_baseDatos: null,
    };

    this._conexionDWHSvc.fg.patchValue(fgValues);
  }
}
