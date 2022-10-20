import { DefaultTopLeftButtonsTable } from './../../shared/models/table-buttons';
import { DefaultInlineButtonsTable } from '../../shared/models/table-buttons';
import { IButtons } from './../../shared/ui/prime-ng/button/button.model';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import {
    IActionItemClickedArgs,
    ActionClicked,
} from './../../shared/models/list-items';
import { ClasificadorEntidadesFormComponent } from './../clasificador-entidades-form/clasificador-entidades-form.component';
import SweetAlert from 'sweetalert2';
import { ClasificadorEntidadesService } from './../shared/services/clasificador-entidades.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { isArray } from 'lodash';

@Component({
    selector: 'app-list-clasificador-entidades',
    templateUrl: './list-clasificador-entidades.component.html',
    styleUrls: ['./list-clasificador-entidades.component.scss'],
})
export class ListClasificadorEntidadesComponent
    implements AfterViewInit, OnDestroy
{
    dataSource: any[];

    displayedColumns: ITableColumns[] = [
        { header: 'Unidad', field: 'Unidad', type: 'string' },
        { header: 'Tipo de Entidad', field: 'TipoEntidad', type: 'string' },
    ];

    inlineButtons: IButtons[] = [];
    topLeftButtons: IButtons[] = [];

    loading = true;

    constructor(
        private _dinamicDialogSvc: DinamicDialogService,
        private _msgSvc: MessageService,
        private _usuarioSvc: UsuarioService,
        private _clasificadorEntidadesSvc: ClasificadorEntidadesService
    ) {
        if (this.hasAdvancedUserPermission()) {
            this.inlineButtons = DefaultInlineButtonsTable;
            this.topLeftButtons = DefaultTopLeftButtonsTable;
        }
    }

    ngAfterViewInit(): void {
        this._loadAllTipoEntidades();
    }

    private _loadAllTipoEntidades(): void {
        try {
            this._clasificadorEntidadesSvc.subscription.push(
                this._clasificadorEntidadesSvc
                    .loadAllClasificadorEntidades()
                    .subscribe({
                        next: response => {
                            this.loading = false;

                            const result = response.getAllClasificadorEntidades;

                            if (!result.success) {
                                return SweetAlert.fire({
                                    icon: 'error',
                                    title: 'ERROR',
                                    text: result.error,
                                    showConfirmButton: true,
                                    confirmButtonText: 'Aceptar',
                                });
                            }

                            this.dataSource = result.data;
                        },
                        error: err => {
                            this.loading = false;
                            SweetAlert.fire({
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

    ngOnDestroy(): void {
        this._clasificadorEntidadesSvc.dispose();
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
                    idUnidad: null,
                    idTipoEntidad: null,
                };
                this._clasificadorEntidadesSvc.fg.patchValue(inputData);

                this._dinamicDialogSvc.open(
                    'Agregar Clasificador de Entidad',
                    ClasificadorEntidadesFormComponent
                );
                this._clasificadorEntidadesSvc.subscription.push(
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

    private _edit(clasificadorEntidad: any): void {
        try {
            this._clasificadorEntidadesSvc.subscription.push(
                this._clasificadorEntidadesSvc
                    .loadClasificadorEntidad(clasificadorEntidad.IdUnidad)
                    .subscribe(response => {
                        const result = response.getClasificadorEntidad;

                        if (!result.success) {
                            return SweetAlert.fire({
                                icon: 'error',
                                title: 'ERROR',
                                text: result.error,
                                showConfirmButton: true,
                                confirmButtonText: 'Aceptar',
                            });
                        }

                        const data = result.data;

                        const inputData = {
                            idUnidad: data.IdUnidad,
                            idTipoEntidad: data.IdTipoEntidad,
                        };
                        this._clasificadorEntidadesSvc.fg.patchValue(inputData);

                        this._dinamicDialogSvc.open(
                            'Modificar Clasificador de Entidad',
                            ClasificadorEntidadesFormComponent
                        );
                        this._clasificadorEntidadesSvc.subscription.push(
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
            if (this.hasAdvancedUserPermission()) {
                SweetAlert.fire({
                    icon: 'question',
                    title: '¿Desea Eliminar el Clasificador de Entidad seleccionada?',
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

                        this._clasificadorEntidadesSvc.subscription.push(
                            this._clasificadorEntidadesSvc
                                .delete(IDsToRemove)
                                .subscribe(response => {
                                    const result =
                                        response.deleteClasificadorEntidad;

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
                                        detail: 'El Clasificador de Entidad se ha eliminado correctamente.',
                                    });
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
