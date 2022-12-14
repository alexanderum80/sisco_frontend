import { DefaultTopLeftButtonsTable } from './../../shared/models/table-buttons';
import { DefaultInlineButtonsTable } from '../../shared/models/table-buttons';
import { IButtons } from './../../shared/ui/prime-ng/button/button.model';
import { ETipoUsuarios } from './../../usuarios/shared/models/usuarios.model';
import { UsuarioService } from './../../shared/services/usuario.service';
import {
    ActionClicked,
    IActionItemClickedArgs,
} from './../../shared/models/list-items';
import { cloneDeep } from '@apollo/client/utilities';
import { CuentasNoPermitidasService } from './../shared/services/cuentas-no-permitidas.service';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { MessageService } from 'primeng/api';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { CuentasNoPermitidasFormComponent } from '../cuentas-no-permitidas-form/cuentas-no-permitidas-form.component';
import { isArray } from 'lodash';

@Component({
    selector: 'app-list-cuentas-no-permitidas',
    templateUrl: './list-cuentas-no-permitidas.component.html',
    styleUrls: ['./list-cuentas-no-permitidas.component.scss'],
})
export class ListCuentasNoPermitidasComponent
    implements AfterViewInit, OnDestroy
{
    columns: ITableColumns[] = [
        { header: 'Cuenta', field: 'Cta', type: 'string' },
        { header: 'SubCuenta', field: 'SubCta', type: 'string' },
        { header: 'Crit1', field: 'Crit1', type: 'string' },
        { header: 'Crit2', field: 'Crit2', type: 'string' },
        { header: 'Crit3', field: 'Crit3', type: 'string' },
        { header: 'Centralizada', field: 'Centralizada', type: 'boolean' },
    ];

    cuentasNoPermitidas: any[] = [];

    inlineButtons: IButtons[] = DefaultInlineButtonsTable;
    topLeftButtons: IButtons[] = DefaultTopLeftButtonsTable;

    loading = true;

    constructor(
        private _cuentasNoPermitidasSvc: CuentasNoPermitidasService,
        private _dinamicDialogSvc: DinamicDialogService,
        private _sweetAlertSvc: SweetalertService,
        private _msgSvc: MessageService,
        private _usuarioSvc: UsuarioService
    ) {}

    ngAfterViewInit(): void {
        this._getCuentasNoPermitidas();
    }

    ngOnDestroy(): void {
        this.cuentasNoPermitidas = [];
        this._cuentasNoPermitidasSvc.dispose();
    }

    private _getCuentasNoPermitidas(): void {
        try {
            this._cuentasNoPermitidasSvc.subscription.push(
                this._cuentasNoPermitidasSvc
                    .loadAllCuentasNoPermitidas()
                    .subscribe(response => {
                        this.loading = false;

                        const result = response.getAllNoUsarEnCuenta;

                        if (result.success === false) {
                            return this._sweetAlertSvc.error(result.error);
                        }

                        this.cuentasNoPermitidas = cloneDeep(result.data);
                    })
            );
        } catch (err: any) {
            this.loading = false;
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
            this._cuentasNoPermitidasSvc.inicializarFg();

            this._dinamicDialogSvc.open(
                'Agregar Cuenta no Permitida',
                CuentasNoPermitidasFormComponent
            );
            this._cuentasNoPermitidasSvc.subscription.push(
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
                    'No tiene permisos para modificar una Cuenta no Permitida Centralizada.'
                );
            }

            this._cuentasNoPermitidasSvc.inicializarFg();
            this._cuentasNoPermitidasSvc
                .loadCuentaNoPermitida(data.Id)
                .subscribe(response => {
                    const result = response.getNoUsarEnCuentaById;

                    if (!result.success) {
                        return this._sweetAlertSvc.error(result.error);
                    }

                    const inputValue = {
                        id: result.data.Id,
                        codigo: result.data.Codigo,
                        cta: result.data.Cta,
                        subcta: result.data.SubCta,
                        crit1: result.data.Crit1,
                        crit2: result.data.Crit2,
                        crit3: result.data.Crit3,
                        centralizada: result.data.Centralizada,
                        idDivision: result.data.IdDivision,
                    };

                    this._cuentasNoPermitidasSvc.fg.patchValue(inputValue);

                    this._dinamicDialogSvc.open(
                        'Editar Cuenta no Permitida',
                        CuentasNoPermitidasFormComponent
                    );
                    this._cuentasNoPermitidasSvc.subscription.push(
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
                });
        } catch (err: any) {
            this._sweetAlertSvc.error(err);
        }
    }

    private _delete(data: any): void {
        try {
            this._sweetAlertSvc
                .question(
                    '??Desea Eliminar la(s) Cuenta(s) no Permitida(s) seleccionada(s)?'
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
                                    'No tiene permisos para eliminar Cuentas no Permitidas Centralizadas. Seleccione s??lo sus Cuentas no Permitidas.'
                                );
                            }
                        }

                        const IDsToRemove: number[] = data.map(
                            (d: { Id: number }) => {
                                return d.Id;
                            }
                        );

                        this._cuentasNoPermitidasSvc
                            .deleteCuentaNoPermitida(IDsToRemove)
                            .subscribe(response => {
                                const result = response.deleteNoUsarEnCuenta;

                                if (!result.success) {
                                    return this._sweetAlertSvc.error(
                                        result.error
                                    );
                                }
                                this._msgSvc.add({
                                    severity: 'success',
                                    summary: 'Satisfactorio',
                                    detail: 'La Cuenta no Permitida se ha eliminado Satisfactoriamente.',
                                });
                            });
                    }
                });
        } catch (err: any) {
            this._sweetAlertSvc.error(err);
        }
    }
}
