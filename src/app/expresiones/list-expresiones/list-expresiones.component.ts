import { ETipoUsuarios } from './../../usuarios/shared/models/usuarios.model';
import { UsuarioService } from './../../shared/services/usuario.service';
import { MessageService } from 'primeng/api';
import {
  ActionClicked,
  IActionItemClickedArgs,
} from './../../shared/models/list-items';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { cloneDeep } from '@apollo/client/utilities';
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

  constructor(
    private _usuarioSvc: UsuarioService,
    private _expresionesSvc: ExpresionesService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlertSvc: SweetalertService,
    private _msgSvc: MessageService
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
        this._expresionesSvc.loadAllExpresionesResumen().subscribe(response => {
          const result = response.getAllExpresionesResumen;

          if (result.success === false) {
            return this._sweetAlertSvc.error(
              `Ocurrió el siguiente error: ${result.error}`
            );
          }

          this.expresiones = cloneDeep(result.data);
        })
      );
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${err}`);
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
            this._msgSvc.add({
              severity: 'success',
              summary: 'Satisfactorio',
              detail: message,
            });
          }
        })
      );
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${err}`);
    }
  }

  private _edit(data: any): void {
    try {
      if (
        this._usuarioSvc.usuario.IdDivision !== 100 &&
        this._usuarioSvc.usuario.IdTipoUsuario !==
          ETipoUsuarios['Usuario Avanzado'] &&
        data.Centralizada
      ) {
        return this._sweetAlertSvc.warning(
          'No tiene permisos para modificar una Expresión Centralizada.'
        );
      }

      this._expresionesSvc.inicializarFg();
      this._expresionesSvc
        .loadExpresionResumenById(data.IdExpresion)
        .subscribe(response => {
          const result = response.getExpresionResumenById;

          if (!result.success) {
            throw new Error(result.error);
          }

          const inputValue = {
            idExpresion: result.data.IdExpresion,
            expresion: result.data.Expresion,
            descripcion: result.data.Descripcion,
            acumulado: result.data.Acumulado,
            operacionesInternas: result.data.OperacionesInternas,
            centralizada: result.data.Centralizada,
            idDivision: result.data.IdDivision,
          };

          this._expresionesSvc.fg.patchValue(inputValue);

          this._dinamicDialogSvc.open(
            'Editar Expresión',
            ExpresionesFormComponent
          );
          this._expresionesSvc.subscription.push(
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
        });
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${err}`);
    }
  }

  private _delete(data: any): void {
    try {
      this._sweetAlertSvc
        .question('¿Desea Eliminar la(s) Expresión(es) seleccionada(s)?')
        .then(res => {
          if (res === ActionClicked.Yes) {
            data = isArray(data) ? data : [data];

            if (
              this._usuarioSvc.usuario.IdDivision !== 100 &&
              this._usuarioSvc.usuario.IdTipoUsuario !==
                ETipoUsuarios['Usuario Avanzado']
            ) {
              const _centralizada: any[] = data.filter(
                (f: { Centralizada: boolean }) => f.Centralizada === true
              );
              if (_centralizada.length) {
                return this._sweetAlertSvc.warning(
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
              .subscribe(response => {
                const result = response.deleteExpresionResumen;

                if (!result.success) {
                  throw new Error(result.error);
                }

                this._msgSvc.add({
                  severity: 'success',
                  summary: 'Satisfactorio',
                  detail: 'La Expresión se ha eliminado correctamente.',
                });
              });
          }
        });
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${err}`);
    }
  }
}
