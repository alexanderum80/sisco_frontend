import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from './../../shared/services/authentication.service';
import { FormGroup, FormControl } from '@angular/forms';
import { DefaultTopLeftButtonsTable } from './../../shared/models/table-buttons';
import { DefaultInlineButtonsTable } from '../../shared/models/table-buttons';
import { IButtons } from './../../shared/ui/prime-ng/button/button.model';
import { SelectItem } from 'primeng/api';
import {
  IActionItemClickedArgs,
  ActionClicked,
} from './../../shared/models/list-items';
import { SweetalertService } from './../../shared/helpers/sweetalert.service';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { ClasificadorCuentaFormComponent } from './../clasificador-cuenta-form/clasificador-cuenta-form.component';
import { ClasificadorCuentaService } from './../shared/service/clasificador-cuenta.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash';
import { IClasificadorCuentas } from '../shared/models/clasificador-cuenta.model';

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

  clasificadorCuentas: IClasificadorCuentas[];

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
    private _authSvc: AuthenticationService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _swalSvc: SweetalertService,
    private _clasificadorCuentaSvc: ClasificadorCuentaService,
    private _toastrSvc: ToastrService
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
            next: res => {
              this.loading = false;

              this.clasificadorCuentas = cloneDeep(
                res.getAllClasificadorCuentas
              );
            },
            error: err => {
              this.loading = false;
              this._swalSvc.error(err);
            },
          })
      );
    } catch (err: any) {
      this.loading = false;
      this._swalSvc.error(err);
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
              this._toastrSvc.success(message, 'Satisfactorio');
            }
          })
        );
      }
    } catch (err: any) {
      this._swalSvc.error(err);
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
            .subscribe({
              next: res => {
                const result = res.getClasificadorCuenta;

                const inputData = {
                  tipoClasificador: result.TipoClasificador,
                  cuenta: result.Cuenta,
                  subcuenta: result.SubCuenta,
                  nombre: result.Nombre,
                  naturaleza: result.Naturaleza,
                  crit1: result.Tipo_Analisis_1,
                  crit2: result.Tipo_Analisis_2,
                  crit3: result.Tipo_Analisis_3,
                  crit4: result.Tipo_Analisis_4,
                  crit5: result.Tipo_Analisis_5,
                  obligacion: result.Obligacion,
                  grupo: result.Grupo?.trim(),
                  clase: result.Clase?.trim(),
                  categoria: result.Categoria?.trim(),
                  clasificacion: result.Clasificacion,
                  tipo: result.Tipo,
                  estado: result.Estado,
                  seUtiliza: result.SeUtiliza
                    ? result.SeUtiliza.split(', ').map(Number)
                    : [],
                  crit1Consolidacion: result.Tipo_Analisis_1_Cons,
                  crit2Consolidacion: result.Tipo_Analisis_2_Cons,
                  crit3Consolidacion: result.Tipo_Analisis_3_Cons,
                  crit4Consolidacion: result.Tipo_Analisis_4_Cons,
                  crit5Consolidacion: result.Tipo_Analisis_5_Cons,
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
                        this._toastrSvc.success(message, 'Satisfactorio');
                      }
                    }
                  )
                );
              },
              error: err => {
                this._swalSvc.error(err);
              },
            })
        );
      }
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _delete(clasificador: any): void {
    try {
      if (this.hasAdvancedUserPermission()) {
        this._swalSvc
          .question(
            'No se podrán deshacer los cambios.',
            '¿Desea Eliminar la Cuenta seleccionada?'
          )
          .then(res => {
            if (res === ActionClicked.Yes) {
              this._clasificadorCuentaSvc.subscription.push(
                this._clasificadorCuentaSvc.delete(clasificador).subscribe({
                  next: res => {
                    const result = res.deleteClasificadorCuenta;

                    if (!result.success) {
                      this._swalSvc.error(result.error);
                    }

                    this._toastrSvc.success(
                      'La Cuenta se ha eliminado correctamente.',
                      'Satisfactorio'
                    );
                  },
                  error: err => {
                    this._swalSvc.error(err);
                  },
                })
              );
            }
          });
      }
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }
}
