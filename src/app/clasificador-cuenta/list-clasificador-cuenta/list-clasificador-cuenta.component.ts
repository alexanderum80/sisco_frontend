import { MessageService } from 'primeng/api';
import {
  IActionItemClickedArgs,
  ActionClicked,
} from './../../shared/models/list-items';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { TiposClasificadorCuenta } from './../shared/models/clasificador-cuenta.model';
import SweetAlert from 'sweetalert2';
import { ClasificadorCuentaFormComponent } from './../clasificador-cuenta-form/clasificador-cuenta-form.component';
import { ClasificadorCuentaService } from './../shared/service/clasificador-cuenta.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { Component, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-list-clasificador-cuenta',
  templateUrl: './list-clasificador-cuenta.component.html',
  styleUrls: ['./list-clasificador-cuenta.component.scss'],
})
export class ListClasificadorCuentaComponent
  implements AfterViewInit, OnDestroy
{
  clasificadorCuentaConso: any[];
  clasificadorCuentaCentro: any[];
  clasificadorCuentaComplejo: any[];

  displayedColumns: ITableColumns[] = [
    { header: 'Cuenta', field: 'Cuenta', type: 'string' },
    { header: 'SubCuenta', field: 'SubCuenta', type: 'string' },
    {
      header: 'Descripción',
      field: 'Descripcion',
      type: 'string',
      width: '350px',
    },
    { header: 'Naturaleza', field: 'Naturaleza', type: 'string' },
    { header: 'Obligación', field: 'Obligacion', type: 'boolean' },
    { header: 'Terminal', field: 'Terminal', type: 'boolean' },
    { header: 'Crit1', field: 'Crit1', type: 'string' },
    { header: 'Crit2', field: 'Crit2', type: 'string' },
    { header: 'Crit3', field: 'Crit3', type: 'string' },
  ];

  loading = true;

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _usuarioSvc: UsuarioService,
    private _sweetalertSvc: SweetalertService,
    private _clasificadorCuentaSvc: ClasificadorCuentaService,
    private _msgSvc: MessageService
  ) {}

  ngAfterViewInit(): void {
    try {
      this._clasificadorCuentaSvc.subscription.push(
        this._clasificadorCuentaSvc.loadAllClasificadorCuenta().subscribe({
          next: response => {
            this.loading = false;

            const result = response.getAllClasificadorCuentas;
            if (!result.success) {
              return SweetAlert.fire({
                icon: 'error',
                title: 'ERROR',
                text: result.error,
                confirmButtonText: 'Aceptar',
              });
            }

            this.clasificadorCuentaConso = result.data.filter(
              (f: { TipoClasificador: TiposClasificadorCuenta }) =>
                f.TipoClasificador === TiposClasificadorCuenta.Consolidado
            );
            this.clasificadorCuentaCentro = result.data.filter(
              (f: { TipoClasificador: TiposClasificadorCuenta }) =>
                f.TipoClasificador === TiposClasificadorCuenta.Centro
            );
            this.clasificadorCuentaComplejo = result.data.filter(
              (f: { TipoClasificador: TiposClasificadorCuenta }) =>
                f.TipoClasificador === TiposClasificadorCuenta.Complejo
            );
          },
          error: err => {
            this.loading = false;
            this._sweetalertSvc.error(err);
          },
        })
      );
    } catch (err: any) {
      this.loading = false;
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: `Ocurrió el siguiente error: ${err}`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  ngOnDestroy(): void {
    this._clasificadorCuentaSvc.dispose();
  }

  hasAdvancedUserPermission(): boolean {
    return this._usuarioSvc.hasAdvancedUserPermission();
  }

  actionClicked(event: IActionItemClickedArgs) {
    switch (event.action) {
      case ActionClicked.Add:
        this._add();
        break;
      case ActionClicked.Edit:
        this._edit(event.item);
        break;
      case ActionClicked.Delete:
        this._delete(event.item);
        break;
    }
  }

  private _add(): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        const inputData = {
          cuenta: '',
          subcuenta: '',
          descripcion: '',
          naturaleza: null,
          crit1: '',
          crit2: '',
          crit3: '',
          obligacion: false,
          tipoClasificador: null,
          seUtiliza: null,
          terminal: false,
          crit1Consolidacion: '',
          crit2Consolidacion: '',
          crit3Consolidacion: '',
        };
        this._clasificadorCuentaSvc.fg.patchValue(inputData);
        this._dinamicDialogSvc.open(
          'Agregar Cuenta',
          ClasificadorCuentaFormComponent
        );
        this._clasificadorCuentaSvc.subscription.push(
          this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
            if (message) {
              this._msgSvc.add({
                severity: 'success',
                summary: 'Satisfactorio',
                detail: message,
              });
            }
          })
        );
      }
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: `Ocurrió el siguiente error: ${err}`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  private _edit(clasificador: {
    Cuenta: string;
    SubCuenta: string;
    TipoClasificador: string;
  }): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        this._clasificadorCuentaSvc.subscription.push(
          this._clasificadorCuentaSvc
            .loadClasificadorCuenta(
              clasificador.Cuenta,
              clasificador.SubCuenta,
              clasificador.TipoClasificador
            )
            .subscribe(response => {
              const result = response.getClasificadorCuenta;
              if (!result.success) {
                return SweetAlert.fire({
                  icon: 'error',
                  title: 'ERROR',
                  text: result.error,
                  confirmButtonText: 'Aceptar',
                });
              }

              const data = result.data;

              const inputData = {
                cuenta: data.Cuenta,
                subcuenta: data.SubCuenta,
                descripcion: data.Descripcion,
                naturaleza: data.Naturaleza,
                crit1: data.Crit1,
                crit2: data.Crit2,
                crit3: data.Crit3,
                obligacion: data.Obligacion,
                tipoClasificador: data.TipoClasificador,
                seUtiliza: data.SeUtiliza.split(', ').map(Number),
                terminal: data.Terminal,
                crit1Consolidacion: data.Crit1Consolidacion,
                crit2Consolidacion: data.Crit2Consolidacion,
                crit3Consolidacion: data.Crit3Consolidacion,
              };

              this._clasificadorCuentaSvc.fg.patchValue(inputData);
              this._dinamicDialogSvc.open(
                'Modificar Cuenta',
                ClasificadorCuentaFormComponent
              );
              this._clasificadorCuentaSvc.subscription.push(
                this._dinamicDialogSvc.ref.onClose.subscribe(
                  (message: string) => {
                    if (message) {
                      this._msgSvc.add({
                        severity: 'success',
                        summary: 'Satisfactorio',
                        detail: message,
                      });
                    }
                  }
                )
              );
            })
        );
      }
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: `Ocurrió el siguiente error: ${err}`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  private _delete(clasificador: any): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        SweetAlert.fire({
          icon: 'question',
          title: '¿Desea Eliminar la Cuenta seleccionada?',
          text: 'No se podrán deshacer los cambios.',
          showConfirmButton: true,
          confirmButtonText: 'Sí',
          showCancelButton: true,
          cancelButtonText: 'No',
        }).then(res => {
          if (res.value) {
            this._clasificadorCuentaSvc.subscription.push(
              this._clasificadorCuentaSvc.delete(clasificador).subscribe({
                next: response => {
                  const result = response.deleteClasificadorCuenta;

                  if (!result.success) {
                    return SweetAlert.fire({
                      icon: 'error',
                      title: 'ERROR',
                      text: `Ocurrió el siguiente error: ${result.error}`,
                      showConfirmButton: true,
                      confirmButtonText: 'Aceptar',
                    });
                  }

                  this._msgSvc.add({
                    severity: 'success',
                    summary: 'Satisfactorio',
                    detail: 'La Cuenta se ha eliminado correctamente.',
                  });
                },
                error: err => {
                  this._sweetalertSvc.error(err);
                },
              })
            );
          }
        });
      }
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: `Ocurrió el siguiente error: ${err}`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }
}
