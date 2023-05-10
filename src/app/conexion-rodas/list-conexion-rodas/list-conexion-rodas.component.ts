import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from './../../shared/services/authentication.service';
import { DefaultTopLeftButtonsTable } from './../../shared/models/table-buttons';
import { DefaultInlineButtonsTable } from '../../shared/models/table-buttons';
import { IButtons } from './../../shared/ui/prime-ng/button/button.model';
import {
  IActionItemClickedArgs,
  ActionClicked,
} from './../../shared/models/list-items';
import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { ConexionRodasService } from './../shared/services/conexion-rodas.service';
import { ConexionRodasFormComponent } from './../conexion-rodas-form/conexion-rodas-form.component';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import SweetAlert from 'sweetalert2';
import { isArray, sortBy } from 'lodash';
import { ITableColumns } from '../../shared/ui/prime-ng/table/table.model';

@Component({
  selector: 'app-list-conexion-rodas',
  templateUrl: './list-conexion-rodas.component.html',
  styleUrls: ['./list-conexion-rodas.component.scss'],
})
export class ListConexionRodasComponent implements AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'División', field: 'Unidad.Division', type: 'string' },
    { header: 'Unidad', field: 'Unidad.Nombre', type: 'string' },
    { header: 'Consolidado', field: 'Consolidado', type: 'boolean' },
    { header: 'IP', field: 'IpRodas', type: 'string' },
    { header: 'Siglas', field: 'BaseDatos', type: 'string' },
  ];

  conexionesRodas: any[] = [];

  inlineButtons: IButtons[] = [];
  topLeftButtons: IButtons[] = [];

  loading = true;

  constructor(
    private _authSvc: AuthenticationService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _conexionRodasSvc: ConexionRodasService,
    private _toastrSvc: ToastrService
  ) {
    if (this.hasAdminPermission()) {
      this.inlineButtons = DefaultInlineButtonsTable;
      this.topLeftButtons = DefaultTopLeftButtonsTable;
    }
  }

  ngAfterViewInit(): void {
    this._loadConexionesRodas();
  }

  ngOnDestroy(): void {
    this._conexionRodasSvc.dispose();
  }

  hasAdminPermission(): boolean {
    return this._authSvc.hasAdminPermission();
  }

  private _loadConexionesRodas(): void {
    try {
      this._conexionRodasSvc.subscription.push(
        this._conexionRodasSvc.loadAllConexionesRodas().subscribe({
          next: res => {
            this.loading = false;

            const result = res.getAllContaConexiones;

            this.conexionesRodas = sortBy(result, ['IdDivision', 'IdUnidad']);
          },
          error: err => {
            this.loading = false;
            return SweetAlert.fire({
              icon: 'error',
              title: 'ERROR',
              text: err,
              showConfirmButton: true,
              confirmButtonText: 'Aceptar',
            });
          },
        })
      );
    } catch (err: any) {
      this.loading = false;

      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
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
      this._conexionRodasSvc.fg.reset();
      this._conexionRodasSvc.fg.patchValue({
        idDivision: this._authSvc.usuario.IdDivision,
      });

      this._dinamicDialogSvc.open(
        'Agregar Conexión al Rodas',
        ConexionRodasFormComponent
      );
      this._conexionRodasSvc.subscription.push(
        this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
          if (message) {
            this._toastrSvc.success(message, 'Satisfactorio');
          }
        })
      );
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  private _edit(data: any): void {
    try {
      if (this.hasAdminPermission()) {
        this._conexionRodasSvc.subscription.push(
          this._conexionRodasSvc.loadConexionById(data.Id).subscribe({
            next: res => {
              const data = res.getContaConexionById;

              const dataInput = {
                id: data.Id,
                idUnidad: data.IdUnidad,
                consolidado: data.Consolidado,
                ip: data.IpRodas,
                baseDatos: data.BaseDatos,
                idDivision: data.IdDivision,
              };
              this._conexionRodasSvc.fg.patchValue(dataInput);

              this._dinamicDialogSvc.open(
                'Modificar Conexión al Rodas',
                ConexionRodasFormComponent
              );
              this._conexionRodasSvc.subscription.push(
                this._dinamicDialogSvc.ref.onClose.subscribe(
                  (message: string) => {
                    if (message) {
                      this._toastrSvc.success(message, 'Satisfactorio');
                    }
                  }
                )
              );
            },
            error: err => {
              return SweetAlert.fire({
                icon: 'error',
                title: 'ERROR',
                html: err,
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
              });
            },
          })
        );
      }
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  private _delete(data: any): void {
    try {
      if (this.hasAdminPermission()) {
        SweetAlert.fire({
          icon: 'question',
          title: '¿Desea Eliminar la(s) Conexión(es) seleccionada(s)?',
          text: 'No se podrán deshacer los cambios.',
          showConfirmButton: true,
          confirmButtonText: 'Sí',
          showCancelButton: true,
          cancelButtonText: 'No',
        }).then(res => {
          if (res.value) {
            const IDsToRemove: number[] = !isArray(data)
              ? [data.Id]
              : data.map(d => {
                  return d.Id;
                });

            this._conexionRodasSvc.subscription.push(
              this._conexionRodasSvc.delete(IDsToRemove).subscribe(res => {
                const result = res.deleteContaConexion;

                if (!result.success) {
                  return SweetAlert.fire({
                    icon: 'error',
                    title: 'ERROR',
                    text: result.error,
                    showConfirmButton: true,
                    confirmButtonText: 'Aceptar',
                  });
                }

                this._conexionRodasSvc.subscription.push(
                  this._dinamicDialogSvc.ref.onClose.subscribe(
                    (message: string) => {
                      if (message) {
                        this._toastrSvc.success(
                          'La Conexión se ha eliminado correctamente.',
                          'Satisfactorio'
                        );
                      }
                    }
                  )
                );
              })
            );
          }
        });
      }
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }
}
