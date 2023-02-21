import { AuthenticationService } from './../shared/services/authentication.service';
import { DinamicDialogService } from './../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { ETipoUsuarios } from './../usuarios/shared/models/usuarios.model';
import SweetAlert from 'sweetalert2';
import { ConexionGoldenDwhService } from './shared/services/conexion-golden-dwh.service';
import { ConexionGoldenDwhFormComponent } from './conexion-golden-dwh-form/conexion-golden-dwh-form.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationService } from '../navigation/shared/services/navigation.service';

@Component({
  selector: 'app-conexion-golden-dwh',
  template: '<div></div>',
})
export class ConexionGoldenDwhComponent implements OnInit, OnDestroy {
  constructor(
    private _authSvc: AuthenticationService,
    private _conexionDWHSvc: ConexionGoldenDwhService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _navigationSvc: NavigationService
  ) {}

  ngOnInit(): void {
    this._conexionDWHSvc.fg.reset();

    if (this._authSvc.usuario.IdTipoUsuario === ETipoUsuarios.Administrador) {
      this._dinamicDialogSvc.open(
        'Actualizar Conexión al Golden DWH',
        ConexionGoldenDwhFormComponent
      );
      this._conexionDWHSvc.subscription.push(
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

  ngOnDestroy(): void {
    this._conexionDWHSvc.dispose();
  }
}
