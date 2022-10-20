import { DefaultTopLeftButtonsTable } from './../../shared/models/table-buttons';
import { DefaultInlineButtonsTable } from '../../shared/models/table-buttons';
import { IButtons } from './../../shared/ui/prime-ng/button/button.model';
import { UsuarioService } from './../../shared/services/usuario.service';
import { ETipoUsuarios } from './../../usuarios/shared/models/usuarios.model';
import {
    ActionClicked,
    IActionItemClickedArgs,
} from './../../shared/models/list-items';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { MessageService } from 'primeng/api';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { CompararExpresionesService } from '../shared/services/comparar-expresiones.service';
import { cloneDeep } from '@apollo/client/utilities';
import { CompararExpresionesFormComponent } from '../comparar-expresiones-form/comparar-expresiones-form.component';
import { isArray } from 'lodash';

@Component({
    selector: 'app-list-comparar-expresiones',
    templateUrl: './list-comparar-expresiones.component.html',
    styleUrls: ['./list-comparar-expresiones.component.scss'],
})
export class ListCompararExpresionesComponent
    implements AfterViewInit, OnDestroy
{
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

    constructor(
        private _usuarioSvc: UsuarioService,
        private _compararExpresionesSvc: CompararExpresionesService,
        private _dinamicDialogSvc: DinamicDialogService,
        private _sweetAlertSvc: SweetalertService,
        private _msgSvc: MessageService
    ) {}

    ngAfterViewInit(): void {
        this._getCompararExpresiones();
    }

    ngOnDestroy(): void {
        this._compararExpresionesSvc.dispose();
        this.compararExpresiones = [];
    }

    private _getCompararExpresiones(): void {
        try {
            this._compararExpresionesSvc.subscription.push(
                this._compararExpresionesSvc.loadAll().subscribe(response => {
                    const result = response.getAllComprobarExpresiones;

                    if (result.success === false) {
                        return this._sweetAlertSvc.error(result.error);
                    }

                    this.compararExpresiones = cloneDeep(result.data);
                })
            );
        } catch (err: any) {
            this._sweetAlertSvc.error(err);
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
                CompararExpresionesFormComponent
            );
            this._compararExpresionesSvc.subscription.push(
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
        } catch (err: any) {
            this._sweetAlertSvc.error(err);
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
                    'No tiene permisos para modificar una Comparación Centralizada.'
                );
            }

            this._compararExpresionesSvc.inicializarFg();
            this._compararExpresionesSvc.subscription.push(
                this._compararExpresionesSvc
                    .loadOne(data.Id)
                    .subscribe(response => {
                        const result = response.getComprobarExpresionById;

                        if (!result.success) {
                            throw new Error(result.error);
                        }

                        const inputValue = {
                            id: result.data.Id,
                            expresion: result.data.IdExpresion,
                            operador: result.data.IdOperador,
                            expresionC: result.data.IdExpresionC,
                            centro: result.data.Centro,
                            complejo: result.data.Complejo,
                            consolidado: result.data.Con,
                            centralizada: result.data.Centralizada,
                            idDivision: result.data.IdDivision,
                        };

                        this._compararExpresionesSvc.fg.patchValue(inputValue);

                        this._dinamicDialogSvc.open(
                            'Editar Comparación de Expresión',
                            CompararExpresionesFormComponent
                        );
                        this._compararExpresionesSvc.subscription.push(
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
        } catch (err: any) {
            this._sweetAlertSvc.error(err);
        }
    }

    private _delete(data: any): void {
        try {
            this._sweetAlertSvc
                .question(
                    '¿Desea Eliminar la(s) Comparación(es) seleccionada(s)?'
                )
                .then(res => {
                    if (res === ActionClicked.Yes) {
                        data = isArray(data) ? data : [data];

                        if (
                            this._usuarioSvc.usuario.IdDivision !== 100 &&
                            this._usuarioSvc.usuario.IdTipoUsuario !==
                                ETipoUsuarios['Usuario Avanzado']
                        ) {
                            const _centralizada: any[] = data.filter(
                                (f: { Centralizada: boolean }) =>
                                    f.Centralizada === true
                            );
                            if (_centralizada.length) {
                                return this._sweetAlertSvc.warning(
                                    'No tiene permisos para eliminar Comparaciones Centralizadas. Seleccione sólo sus comparaciones.'
                                );
                            }
                        }

                        const IDsToRemove: number[] = data.map(
                            (d: { Id: number }) => {
                                return d.Id;
                            }
                        );

                        this._compararExpresionesSvc.subscription.push(
                            this._compararExpresionesSvc
                                .delete(IDsToRemove)
                                .subscribe(response => {
                                    const result =
                                        response.deleteComprobarExpresion;

                                    if (!result.success) {
                                        throw new Error(result.error);
                                    }

                                    this._msgSvc.add({
                                        severity: 'success',
                                        summary: 'Satisfactorio',
                                        detail: 'La Comparación se ha eliminado Satisfactoriamente.',
                                    });
                                })
                        );
                    }
                });
        } catch (err: any) {
            this._sweetAlertSvc.error(err);
        }
    }
}
