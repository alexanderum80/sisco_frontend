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
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { SweetalertService } from './../../shared/helpers/sweetalert.service';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { Component, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { CompararExpresionesService } from '../shared/services/comparar-expresiones.service';
import { cloneDeep } from '@apollo/client/utilities';
import { CompararExpresionesFormComponent } from '../comparar-expresiones-form/comparar-expresiones-form.component';
import { isArray } from 'lodash';

@Component({
  selector: 'app-list-comparar-expresiones',
  templateUrl: './list-comparar-expresiones.component.html',
  styleUrls: ['./list-comparar-expresiones.component.scss'],
})
export class ListCompararExpresionesComponent implements OnInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'Expresión', field: 'Expresion.Expresion', type: 'string' },
    { header: 'Operador', field: 'Operador.Operador', type: 'string' },
    { header: 'Expresión', field: 'ExpresionC.Expresion', type: 'string' },
    { header: 'Centro', field: 'Centro', type: 'boolean' },
    { header: 'Complejo', field: 'Complejo', type: 'boolean' },
    { header: 'Consolidado', field: 'Con', type: 'boolean' },
    { header: 'Centralizada', field: 'Centralizada', type: 'boolean' },
  ];

  compararExpresiones: any[] = [];

  inlineButtons: IButtons[] = DefaultInlineButtonsTable;
  topLeftButtons: IButtons[] = DefaultTopLeftButtonsTable;

  loading = true;

  constructor(
    private _authSvc: AuthenticationService,
    private _compararExpresionesSvc: CompararExpresionesService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _swalSvc: SweetalertService,
    private _toastrSvc: ToastrService
  ) {}

  ngOnInit(): void {
    this._getCompararExpresiones();
  }

  ngOnDestroy(): void {
    this._compararExpresionesSvc.dispose();
    this.compararExpresiones = [];
  }

  private _getCompararExpresiones(): void {
    try {
      this._compararExpresionesSvc.subscription.push(
        this._compararExpresionesSvc.loadAll().subscribe({
          next: res => {
            this.loading = false;

            const result = res.getAllComprobarExpresiones;

            this.compararExpresiones = cloneDeep(result);
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
      this._compararExpresionesSvc.inicializarFg();

      this._dinamicDialogSvc.open(
        'Agregar Comparación de Expresión',
        CompararExpresionesFormComponent,
        '800px'
      );
      this._compararExpresionesSvc.subscription.push(
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
          'No tiene permisos para modificar una Comparación Centralizada.'
        );
      }

      this._compararExpresionesSvc.inicializarFg();
      this._compararExpresionesSvc.subscription.push(
        this._compararExpresionesSvc.loadOne(data.Id).subscribe({
          next: res => {
            const result = res.getComprobarExpresionById;

            const inputValue = {
              id: result.Id,
              expresion: result.IdExpresion,
              operador: result.IdOperador,
              expresionC: result.IdExpresionC,
              centro: result.Centro,
              complejo: result.Complejo,
              consolidado: result.Con,
              centralizada: result.Centralizada,
              idDivision: result.IdDivision,
            };

            this._compararExpresionesSvc.fg.patchValue(inputValue);

            this._dinamicDialogSvc.open(
              'Editar Comparación de Expresión',
              CompararExpresionesFormComponent,
              '800px'
            );
            this._compararExpresionesSvc.subscription.push(
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
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _delete(data: any): void {
    try {
      this._swalSvc
        .question('¿Desea Eliminar la(s) Comparación(es) seleccionada(s)?')
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
                  'No tiene permisos para eliminar Comparaciones Centralizadas. Seleccione sólo sus comparaciones.'
                );
              }
            }

            const IDsToRemove: number[] = data.map((d: { Id: number }) => {
              return d.Id;
            });

            this._compararExpresionesSvc.subscription.push(
              this._compararExpresionesSvc
                .delete(IDsToRemove)
                .subscribe(res => {
                  const result = res.deleteComprobarExpresion;

                  if (!result.success) {
                    throw new Error(result.error);
                  }

                  this._toastrSvc.success(
                    'La Comparación se ha eliminado Satisfactoriamente.',
                    'Satisfactorio'
                  );
                })
            );
          }
        });
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }
}
