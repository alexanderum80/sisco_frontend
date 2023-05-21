import { AuthenticationService } from './../../shared/services/authentication.service';
import { DinamicDialogService } from 'src/app/shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { SweetalertService } from './../../shared/helpers/sweetalert.service';
import { TipoUsuariosService } from './../../shared/services/tipo-usuarios.service';
import { SelectItem } from 'primeng/api';
import { ActionClicked } from './../../shared/models/list-items';
import { DivisionesService } from './../../shared/services/divisiones.service';
import { ETipoUsuarios } from './../shared/models/usuarios.model';
import { UsuarioService } from '../shared/services/usuario.service';
import { FormGroup } from '@angular/forms';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss'],
})
export class UsuarioFormComponent implements OnInit, AfterContentChecked {
  action: ActionClicked;

  fg: FormGroup;

  divisionesValues: SelectItem[] = [];

  tipoUsuariosValues: SelectItem[] = [];

  constructor(
    private _authSvc: AuthenticationService,
    private _usuarioSvc: UsuarioService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _tipoUsuariosSvc: TipoUsuariosService,
    private _divisionesSvc: DivisionesService,
    private _swalSvc: SweetalertService,
    private _cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fg = this._usuarioSvc.fg;

    this._getTipoUsuarios();

    this._getDivisiones();

    this._subscribeToFgChanges();

    this.action =
      this.fg.controls['idUsuario'].value === 0
        ? ActionClicked.Add
        : ActionClicked.Edit;
  }

  ngAfterContentChecked(): void {
    this._cd.detectChanges();
  }

  private _getTipoUsuarios(): void {
    try {
      this._usuarioSvc.subscription.push(
        this._tipoUsuariosSvc.getAllTipoUsuarios().subscribe(res => {
          const result = res.getAllTipoUsuarios;

          this.tipoUsuariosValues = result.data.map(
            (c: { IdTipo: any; TipoUsuario: any }) => {
              return {
                value: c.IdTipo,
                label: c.TipoUsuario,
              };
            }
          );
        })
      );
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _getDivisiones(): void {
    try {
      this._usuarioSvc.subscription.push(
        this._divisionesSvc.getDivisionesByUsuario().subscribe({
          next: res => {
            const result = res.getAllDivisionesByUsuario;

            this.divisionesValues = result.map(d => {
              return {
                value: d.IdDivision,
                label: d.IdDivision + '-' + d.Division,
              };
            });
          },
          error: err => {
            this._swalSvc.error(err);
          },
        })
      );
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _subscribeToFgChanges(): void {
    this.fg.controls['contrasena'].valueChanges.subscribe(value => {
      if (value.length === 0) {
        this.fg.controls['contrasena'].setErrors({ required: true });
      } else if (value.length < 6) {
        this.fg.controls['contrasena'].setErrors({ minLength: true });
      } else {
        this.fg.controls['contrasena'].setErrors(null);
      }
    });

    this.fg.controls['contrasenaConfirm'].valueChanges.subscribe(value => {
      if (value.length === 0) {
        this.fg.controls['contrasenaConfirm'].setErrors({
          required: true,
        });
      } else if (value.length < 6) {
        this.fg.controls['contrasenaConfirm'].setErrors({
          minLength: true,
        });
      } else {
        this.fg.controls['contrasenaConfirm'].setErrors(null);
      }
    });

    this.fg.controls['tipoUsuario'].valueChanges.subscribe(() => {
      this.fg.controls['contrasenaAvanzada'].setErrors(null);
    });
  }

  get isSuperAdmin(): boolean {
    return this._authSvc.hasSuperAdminPermission();
  }

  get isUsuarioAvanzado(): boolean {
    return (
      this.fg.get('tipoUsuario')?.value === ETipoUsuarios['Usuario Avanzado']
    );
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
      this._swalSvc.warning(
        'Las contraseñas introducidas no coinciden. Rectifique.'
      );
      return;
    }

    this._usuarioSvc.subscription.push(
      this._usuarioSvc.save().subscribe({
        next: res => {
          let result;
          let txtMessage;

          if (this.action === ActionClicked.Add) {
            result = res.createUsuario;
            txtMessage = 'El Usuario se ha creado correctamente.';
          } else {
            result = res.updateUsuario;
            txtMessage = 'El Usuario se ha actualizado correctamente.';
          }

          if (!result?.success) {
            return this._swalSvc.error(result?.error || '');
          }

          this._closeModal(txtMessage);
        },
        error: err => {
          this._swalSvc.error(err);
        },
      })
    );
  }

  private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }
}
