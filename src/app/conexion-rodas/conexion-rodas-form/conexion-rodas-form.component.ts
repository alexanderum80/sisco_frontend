import { Subscription } from 'rxjs';
import { ActionClicked } from './../../shared/models/list-items';
import { SelectItem } from 'primeng/api';
import { UnidadesService } from './../../unidades/shared/services/unidades.service';
import { DatabasesService } from './../../shared/services/databases.service';
import { DivisionesService } from './../../shared/services/divisiones.service';
import { toNumber } from 'lodash';
import { ConexionRodasService } from './../shared/services/conexion-rodas.service';
import { FormGroup } from '@angular/forms';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import SweetAlert from 'sweetalert2';
import { UsuarioService } from '../../shared/services/usuario.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-conexion-rodas-form',
    templateUrl: './conexion-rodas-form.component.html',
    styleUrls: ['./conexion-rodas-form.component.scss'],
})
export class ConexionRodasFormComponent implements OnInit, AfterViewInit {
    divisionesValues: SelectItem[] = [];
    unidadesValues: SelectItem[] = [];
    baseDatosValues: SelectItem[] = [];

    action: ActionClicked;

    fg: FormGroup;

    subscription: Subscription[] = [];

    loadingDataBase = false;

    constructor(
        private _usuarioSvc: UsuarioService,
        private _conexionRodasSvc: ConexionRodasService,
        private _dinamicDialogSvc: DinamicDialogService,
        private _divisionesSvc: DivisionesService,
        private _unidadesSvc: UnidadesService,
        private _databasesSvc: DatabasesService
    ) {}

    ngOnInit(): void {
        this.fg = this._conexionRodasSvc.fg;

        this.action =
            toNumber(this.fg.controls['idUnidad'].value) === 0
                ? ActionClicked.Add
                : ActionClicked.Edit;
        if (this.action === ActionClicked.Edit) {
            this.refreshDataBases();
        }

        this._getDivisiones();
    }

    ngAfterViewInit(): void {
        this._getUnidades();
        this._subscribeToFgValueChange();
    }

    private _subscribeToFgValueChange(): void {
        this.subscription.push(
            this.fg.controls['idDivision'].valueChanges.subscribe(() => {
                this.fg.controls['idUnidad'].setValue(null);
                this._getUnidades();
            })
        );

        this.subscription.push(
            this.fg.controls['ip'].valueChanges.subscribe(() => {
                this.fg.controls['baseDatos'].setValue(null);
                this.baseDatosValues = [];
            })
        );

        this.subscription.push(
            this.fg.controls['usuario'].valueChanges.subscribe(() => {
                this.fg.controls['baseDatos'].setValue(null);
                this.baseDatosValues = [];
            })
        );

        this.subscription.push(
            this.fg.controls['contrasena'].valueChanges.subscribe(() => {
                this.fg.controls['baseDatos'].setValue(null);
                this.baseDatosValues = [];
            })
        );
    }

    get isAdminPermission(): boolean {
        return this._usuarioSvc.hasAdminPermission();
    }

    private _getDivisiones(): void {
        try {
            this._conexionRodasSvc.subscription.push(
                this._divisionesSvc.getDivisiones().subscribe(response => {
                    const result = response.getAllDivisiones;

                    if (!result.success) {
                        return SweetAlert.fire({
                            icon: 'error',
                            title: 'ERROR',
                            text: result.error,
                            showConfirmButton: true,
                            confirmButtonText: 'Aceptar',
                        });
                    }

                    this.divisionesValues = result.data.map(
                        (d: { IdDivision: string; Division: string }) => {
                            return {
                                value: d.IdDivision,
                                label: d.IdDivision + '-' + d.Division,
                            };
                        }
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

    private _getUnidades(): void {
        try {
            this.unidadesValues = [];
            const idDivision = this.fg.controls['idDivision'].value;

            if (!idDivision) {
                return;
            }

            this._conexionRodasSvc.subscription.push(
                this._unidadesSvc
                    .getUnidadesByIdDivision(idDivision)
                    .subscribe(response => {
                        const result = response.getUnidadesByIdDivision;

                        if (!result.success) {
                            return SweetAlert.fire({
                                icon: 'error',
                                title: 'ERROR',
                                text: result.error,
                                showConfirmButton: true,
                                confirmButtonText: 'Aceptar',
                            });
                        }

                        this.unidadesValues = result.data.map(
                            (d: { IdUnidad: number; Nombre: string }) => {
                                return {
                                    value: d.IdUnidad,
                                    label: d.IdUnidad + '-' + d.Nombre,
                                };
                            }
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

    refreshDataBases(): void {
        try {
            this.loadingDataBase = true;

            const ip = this.fg.controls['ip'].value;
            const usuario = this.fg.controls['usuario'].value;
            const password = this.fg.controls['contrasena'].value;

            const that = this;
            this._conexionRodasSvc.subscription.push(
                this._databasesSvc
                    .getDataBases(ip, usuario, password)
                    .subscribe(response => {
                        this.loadingDataBase = false;

                        const result = response.getDataBases;

                        if (!result.success) {
                            return SweetAlert.fire({
                                icon: 'error',
                                title: 'ERROR',
                                text: result.error,
                                showConfirmButton: true,
                                confirmButtonText: 'Aceptar',
                            });
                        }

                        that.baseDatosValues = result.data.map(
                            (d: { name: any }) => {
                                return {
                                    value: d.name,
                                    label: d.name,
                                };
                            }
                        );
                    })
            );
        } catch (err: any) {
            this.loadingDataBase = false;

            SweetAlert.fire({
                icon: 'error',
                title: 'ERROR',
                text: err,
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
            });
        }
    }

    onActionClicked(action: ActionClicked) {
        switch (action) {
            case ActionClicked.Save:
                this._save();
                break;
            case ActionClicked.Cancel:
                this._closeModal();
                break;
        }
    }

    private _save(): void {
        try {
            this._conexionRodasSvc.subscription.push(
                this._conexionRodasSvc.save().subscribe({
                    next: (response: any) => {
                        let result;
                        let txtMessage;

                        if (this.action === ActionClicked.Add) {
                            result = response.createContaConexion;
                            txtMessage =
                                'La Conexión se ha creado correctamente.';
                        } else {
                            result = response.updateContaConexion;
                            txtMessage =
                                'La Conexión se ha actualizado correctamente.';
                        }

                        if (!result.success) {
                            throw new Error(result.error);
                        }

                        this._closeModal(txtMessage);
                    },
                    error: error => {
                        SweetAlert.fire({
                            icon: 'error',
                            title: 'ERROR',
                            text: error,
                            showConfirmButton: true,
                            confirmButtonText: 'Aceptar',
                        });
                    },
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

    private _closeModal(message?: string): void {
        this.subscription.forEach(subs => subs.unsubscribe());
        this._dinamicDialogSvc.close(message);
    }
}
