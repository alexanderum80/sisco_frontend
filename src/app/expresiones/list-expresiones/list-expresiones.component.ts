import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from './../../shared/services/authentication.service';
import { DefaultTopLeftButtonsTable } from './../../shared/models/table-buttons';
import { DefaultInlineButtonsTable } from '../../shared/models/table-buttons';
import { IButtons } from './../../shared/ui/prime-ng/button/button.model';
import { ETipoUsuarios } from './../../usuarios/shared/models/usuarios.model';
import {
  ActionClicked,
  IActionItemClickedArgs,
} from './../../shared/models/list-items';
import { SweetalertService } from './../../shared/helpers/sweetalert.service';
import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { ITableColumns } from '../../shared/ui/prime-ng/table/table.model';
import { ExpresionesFormComponent } from '../expresiones-form/expresiones-form.component';
import { ExpresionesService } from '../shared/services/expresiones.service';
import { DinamicDialogService } from '../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { isArray } from 'lodash';

@Component({
  selector: 'app-list-expresiones',
  templateUrl: './list-expresiones.component.html',
  styleUrls: ['./list-expresiones.component.scss'],
})
export class ListExpresionesComponent implements AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'Expresión', field: 'Expresion', type: 'string' },
    { header: 'Descripción', field: 'Descripcion', type: 'string' },
    { header: 'Acumulado', field: 'Acumulado', type: 'boolean' },
    {
      header: 'Operaciones Internas',
      field: 'OperacionesInternas',
      type: 'boolean',
    },
    { header: 'Centralizada', field: 'Centralizada', type: 'boolean' },
  ];

  expresiones: any[] = [];

  inlineButtons: IButtons[] = DefaultInlineButtonsTable;
  topLeftButtons: IButtons[] = DefaultTopLeftButtonsTable;

  loading = true;

  constructor(
    private _authSvc: AuthenticationService,
    private _expresionesSvc: ExpresionesService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _swalSvc: SweetalertService,
    private _toastrSvc: ToastrService
  ) {}

  ngAfterViewInit(): void {
    this._getExpresionesResumen();
  }

  ngOnDestroy(): void {
    this.expresiones = [];
    this._expresionesSvc.dispose();
  }

  private _getExpresionesResumen(): void {
    try {
      this._expresionesSvc.subscription.push(
        this._expresionesSvc.loadAllExpresionesResumen().subscribe({
          next: res => {
            this.loading = false;

            this.expresiones = [...res.getAllExpresionesResumen];
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
      this._expresionesSvc.inicializarFg();

      this._dinamicDialogSvc.open(
        'Agregar Expresión',
        ExpresionesFormComponent
      );
      this._expresionesSvc.subscription.push(
        this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
          if (message) {
            this._toastrSvc.success(message, 'Satisfactorio');
          }
        })
      );
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _edit(data: any): void {
    try {
      if (
        this._authSvc.usuario.IdDivision !== 100 &&
        this._authSvc.usuario.IdTipoUsuario !==
          ETipoUsuarios['Usuario Avanzado'] &&
        data.Centralizada
      ) {
        return this._swalSvc.warning(
          'No tiene permisos para modificar una Expresión Centralizada.'
        );
      }

      this._expresionesSvc.inicializarFg();
      this._expresionesSvc
        .loadExpresionResumenById(data.IdExpresion)
        .subscribe({
          next: res => {
            const result = res.getExpresionResumenById;

            const inputValue = {
              idExpresion: result.IdExpresion,
              expresion: result.Expresion,
              descripcion: result.Descripcion,
              acumulado: result.Acumulado,
              operacionesInternas: result.OperacionesInternas,
              centralizada: result.Centralizada,
              idDivision: result.IdDivision,
            };

            this._expresionesSvc.fg.patchValue(inputValue);

            this._dinamicDialogSvc.open(
              'Editar Expresión',
              ExpresionesFormComponent
            );
            this._expresionesSvc.subscription.push(
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
        });
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _delete(data: any): void {
    try {
      this._swalSvc
        .question('¿Desea Eliminar la(s) Expresión(es) seleccionada(s)?')
        .then(res => {
          if (res === ActionClicked.Yes) {
            data = isArray(data) ? data : [data];

            if (
              this._authSvc.usuario.IdDivision !== 100 &&
              this._authSvc.usuario.IdTipoUsuario !==
                ETipoUsuarios['Usuario Avanzado']
            ) {
              const _centralizada: any[] = data.filter(
                (f: { Centralizada: boolean }) => f.Centralizada === true
              );
              if (_centralizada.length) {
                return this._swalSvc.warning(
                  'No tiene permisos para eliminar Expresiones Centralizadas. Seleccione sólo sus Expresiones.'
                );
              }
            }

            const IDsToRemove: number[] = data.map(
              (d: { IdExpresion: number }) => {
                return d.IdExpresion;
              }
            );

            this._expresionesSvc
              .deleteExpresionResumen(IDsToRemove)
              .subscribe(res => {
                const result = res.deleteExpresionResumen;

                if (!result.success) {
                  return this._swalSvc.error(result.error);
                }

                this._toastrSvc.success(
                  'La Expresión se ha eliminado correctamente.',
                  'Satisfactorio'
                );
              });
          }
        });
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }
}
