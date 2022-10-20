import { DefaultTopLeftButtonsTable } from './../../shared/models/table-buttons';
import { DefaultInlineButtonsTable } from '../../shared/models/table-buttons';
import { IButtons } from './../../shared/ui/prime-ng/button/button.model';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { MessageService } from 'primeng/api';
import {
    IActionItemClickedArgs,
    ActionClicked,
} from './../../shared/models/list-items';
import { IUsuario } from './../../shared/models/usuarios';
import { UsuarioFormComponent } from './../usuario-form/usuario-form.component';
import { UsuarioService } from '../../shared/services/usuario.service';
import { UsuariosMutationResponse } from '../shared/models/usuarios.model';
import SweetAlert from 'sweetalert2';
import { QueryRef, Apollo } from 'apollo-angular';
import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { usuariosApi } from '../shared/graphql/usuarioActions.gql';
import { UsuariosQueryResponse } from '../shared/models/usuarios.model';
import { ITableColumns } from 'src/app/shared/ui/prime-ng/table/table.model';
import { cloneDeep } from '@apollo/client/utilities';
import { isArray } from 'lodash';

@Component({
    selector: 'app-usuarios',
    templateUrl: './list-usuarios.component.html',
    styleUrls: ['./list-usuarios.component.scss'],
})
export class ListUsuariosComponent implements AfterViewInit, OnDestroy {
    listUsuarioQuery: QueryRef<UsuariosQueryResponse>;

    columns: ITableColumns[] = [
        { header: 'Usuario', field: 'Usuario', type: 'string' },
        {
            header: 'Tipo de Usuario',
            field: 'TipoUsuario.TipoUsuario',
            type: 'string',
        },
        { header: 'División', field: 'Division.Division', type: 'string' },
    ];

    usuarios: IUsuario[] = [];

    inlineButtons: IButtons[] = [];
    topLeftButtons: IButtons[] = [];

    loading = true;

    constructor(
        private _apollo: Apollo,
        private _dinamicDialogSvc: DinamicDialogService,
        private _usuarioSvc: UsuarioService,
        private _msgSvc: MessageService
    ) {
        if (this.hasAdminPermission()) {
            this.inlineButtons = DefaultInlineButtonsTable;
            this.topLeftButtons = DefaultTopLeftButtonsTable;
        }
    }

    ngAfterViewInit(): void {
        this._getUsuarios();
    }

    ngOnDestroy(): void {
        this._usuarioSvc.subscription.forEach(subs => subs.unsubscribe());
    }

    hasAdminPermission(): boolean {
        return this._usuarioSvc.hasAdminPermission();
    }

    private _getUsuarios(): void {
        try {
            this._usuarioSvc.subscription.push(
                this._apollo
                    .watchQuery<UsuariosQueryResponse>({
                        query: usuariosApi.all,
                        fetchPolicy: 'network-only',
                    })
                    .valueChanges.subscribe(({ data }) => {
                        this.loading = false;

                        const result = data.getAllUsuarios;

                        if (result.success === false) {
                            return SweetAlert.fire({
                                icon: 'error',
                                title: 'ERROR',
                                text: result.error,
                                showConfirmButton: true,
                                confirmButtonText: 'Aceptar',
                            });
                        }

                        this.usuarios = cloneDeep(result.data);
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
        if (this.hasAdminPermission()) {
            const inputData = {
                idUsuario: null,
                usuario: '',
                contrasena: '',
                tipoUsuario: null,
                cambiarContrasena: false,
                contrasenaAvanzada: '',
                idDivision: this._usuarioSvc.usuario.IdDivision,
            };
            this._usuarioSvc.fg.patchValue(inputData);

            this._dinamicDialogSvc.open(
                'Agregar Usuario',
                UsuarioFormComponent
            );
            this._usuarioSvc.subscription.push(
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
    }

    private _edit(data: any): void {
        if (this.hasAdminPermission()) {
            const idUsuario = data.IdUsuario;

            this._usuarioSvc.subscription.push(
                this._apollo
                    .query<UsuariosQueryResponse>({
                        query: usuariosApi.byId,
                        variables: { id: idUsuario },
                        fetchPolicy: 'network-only',
                    })
                    .subscribe(response => {
                        const result = response.data.getUsuarioById;

                        if (!result.success) {
                            return SweetAlert.fire({
                                icon: 'error',
                                title: 'ERROR',
                                text: result.error,
                                showConfirmButton: true,
                                confirmButtonText: 'Aceptar',
                            });
                        }

                        const selectedUsuario = result.data;

                        const inputData = {
                            idUsuario: selectedUsuario.IdUsuario,
                            usuario: selectedUsuario.Usuario,
                            contrasena: '',
                            tipoUsuario: selectedUsuario.TipoUsuario.IdTipo,
                            contrasenaAvanzada: '',
                            idDivision: selectedUsuario.Division.IdDivision,
                        };

                        this._usuarioSvc.fg.patchValue(inputData);

                        this._dinamicDialogSvc.open(
                            'Modificar Usuario',
                            UsuarioFormComponent
                        );
                        this._usuarioSvc.subscription.push(
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
    }

    private _delete(data: any): void {
        if (this.hasAdminPermission()) {
            SweetAlert.fire({
                icon: 'question',
                title: '¿Desea Eliminar el(los) Usuario(s) seleccionado(s)?',
                text: 'No se podrán deshacer los cambios.',
                showConfirmButton: true,
                confirmButtonText: 'Sí',
                showCancelButton: true,
                cancelButtonText: 'No',
            }).then(res => {
                if (res.value) {
                    const IDsToRemove: number[] = !isArray(data)
                        ? [data.IdUsuario]
                        : data.map(d => {
                              return d.IdUsuario;
                          });

                    this._usuarioSvc.subscription.push(
                        this._apollo
                            .mutate<UsuariosMutationResponse>({
                                mutation: usuariosApi.delete,
                                variables: { IDs: IDsToRemove },
                                refetchQueries: ['GetAllUsuarios'],
                            })
                            .subscribe(response => {
                                const result = response.data?.deleteUsuario;

                                if (result?.success === false) {
                                    return SweetAlert.fire({
                                        icon: 'error',
                                        title: 'ERROR',
                                        text: `Ocurrió el siguiente error: ${result?.error}`,
                                        showConfirmButton: true,
                                        confirmButtonText: 'Aceptar',
                                    });
                                }

                                this._msgSvc.add({
                                    severity: 'success',
                                    summary: 'Satisfactorio',
                                    detail: 'El Usuario se ha eliminado correctamente.',
                                });
                            })
                    );
                }
            });
        }
    }
}
