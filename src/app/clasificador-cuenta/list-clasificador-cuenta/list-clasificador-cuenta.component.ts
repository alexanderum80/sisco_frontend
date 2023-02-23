import { AuthenticationService } from './../../shared/services/authentication.service';
import { FormGroup, FormControl } from '@angular/forms';
import { DefaultTopLeftButtonsTable } from './../../shared/models/table-buttons';
import { DefaultInlineButtonsTable } from '../../shared/models/table-buttons';
import { IButtons } from './../../shared/ui/prime-ng/button/button.model';
import { MessageService, SelectItem } from 'primeng/api';
import {
  IActionItemClickedArgs,
  ActionClicked,
} from './../../shared/models/list-items';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import SweetAlert from 'sweetalert2';
import { ClasificadorCuentaFormComponent } from './../clasificador-cuenta-form/clasificador-cuenta-form.component';
import { ClasificadorCuentaService } from './../shared/service/clasificador-cuenta.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-clasificador-cuenta',
  templateUrl: './list-clasificador-cuenta.component.html',
  styleUrls: ['./list-clasificador-cuenta.component.scss'],
})
export class ListClasificadorCuentaComponent implements OnInit, OnDestroy {
  fg: FormGroup = new FormGroup({
    tipo: new FormControl(1),
  });

  clasificadorCuentasTipoValues: SelectItem[] = [
    { value: 1, label: 'Consolidado' },
    { value: 2, label: 'Centro' },
    { value: 3, label: 'Complejo' },
  ];

  clasificadorCuentas: any[];

  displayedColumns: ITableColumns[] = [
    { header: 'Cuenta', field: 'Cuenta', type: 'string', width: '100px' },
    { header: 'SubCuenta', field: 'SubCuenta', type: 'string' },
    {
      header: 'Nombre',
      field: 'Nombre',
      type: 'string',
      width: '350px',
    },
    { header: 'Naturaleza', field: 'Naturaleza', type: 'string' },
    { header: 'Obligación', field: 'Obligacion', type: 'boolean' },
    { header: 'Crit 1', field: 'Tipo_Analisis_1', type: 'string' },
    { header: 'Crit 2', field: 'Tipo_Analisis_2', type: 'string' },
    { header: 'Crit 3', field: 'Tipo_Analisis_3', type: 'string' },
    { header: 'Crit 4', field: 'Tipo_Analisis_4', type: 'string' },
    { header: 'Crit 5', field: 'Tipo_Analisis_5', type: 'string' },
  ];

  inlineButtons: IButtons[] = [];
  topLeftButtons: IButtons[] = [];

  loading = true;

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _authSvc: AuthenticationService,
    private _sweetalertSvc: SweetalertService,
    private _clasificadorCuentaSvc: ClasificadorCuentaService,
    private _msgSvc: MessageService
  ) {
    if (this.hasAdvancedUserPermission()) {
      this.inlineButtons = DefaultInlineButtonsTable;
      this.topLeftButtons = DefaultTopLeftButtonsTable;
    }
  }

  ngOnInit(): void {
    this._loadClasificadorCuenta();

    this._subscribeToFgChange();
  }

  private _loadClasificadorCuenta(): void {
    try {
      this.loading = true;
      this.clasificadorCuentas = [];

      this._clasificadorCuentaSvc.subscription.push(
        this._clasificadorCuentaSvc
          .loadAllClasificadorCuenta(+this.fg.get('tipo')?.value)
          .subscribe({
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

              this.clasificadorCuentas = result.data;
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
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  ngOnDestroy(): void {
    this._clasificadorCuentaSvc.dispose();
  }

  private _subscribeToFgChange(): void {
    this._clasificadorCuentaSvc.subscription.push(
      this.fg.valueChanges.subscribe(() => {
        this._loadClasificadorCuenta();
      })
    );
  }

  hasAdvancedUserPermission(): boolean {
    return this._authSvc.hasAdvancedUserPermission();
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
        this._clasificadorCuentaSvc.fg.reset();
        this._clasificadorCuentaSvc.fg.patchValue({
          tipoClasificador: +this.fg.get('tipo')?.value,
        });
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
        text: err,
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
                tipoClasificador: data.TipoClasificador,
                cuenta: data.Cuenta,
                subcuenta: data.SubCuenta,
                nombre: data.Nombre,
                naturaleza: data.Naturaleza,
                crit1: data.Tipo_Analisis_1,
                crit2: data.Tipo_Analisis_2,
                crit3: data.Tipo_Analisis_3,
                crit4: data.Tipo_Analisis_4,
                crit5: data.Tipo_Analisis_5,
                obligacion: data.Obligacion,
                grupo: data.Grupo.trim(),
                clase: data.Clase.trim(),
                categoria: data.Categoria.trim(),
                clasificacion: data.Clasificacion,
                tipo: data.Tipo,
                estado: data.Estado,
                seUtiliza: data.SeUtiliza
                  ? data.SeUtiliza.split(', ').map(Number)
                  : [],
                crit1Consolidacion: data.Tipo_Analisis_1_Cons,
                crit2Consolidacion: data.Tipo_Analisis_2_Cons,
                crit3Consolidacion: data.Tipo_Analisis_3_Cons,
                crit4Consolidacion: data.Tipo_Analisis_4_Cons,
                crit5Consolidacion: data.Tipo_Analisis_5_Cons,
              };

              this._clasificadorCuentaSvc.fg.patchValue(inputData);
              this._dinamicDialogSvc.open(
                'Modificar Cuenta',
                ClasificadorCuentaFormComponent,
                '1000px'
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
        text: err,
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
                      text: result.error,
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
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }
}
