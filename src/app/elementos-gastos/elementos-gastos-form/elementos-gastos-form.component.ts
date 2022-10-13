import { ActionClicked } from './../../shared/models/list-items';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import SweetAlert from 'sweetalert2';
import { TipoEntidadesService } from './../../tipo-entidades/shared/services/tipo-entidades.service';
import { ClasificadorCuentaService } from './../../clasificador-cuenta/shared/service/clasificador-cuenta.service';
import { EpigrafesService } from './../../epigrafes/shared/services/epigrafes.service';
import { ElementosGastosService } from './../shared/services/elementos-gastos.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
    selector: 'app-elementos-gastos-form',
    templateUrl: './elementos-gastos-form.component.html',
    styleUrls: ['./elementos-gastos-form.component.scss'],
    providers: [EpigrafesService, ClasificadorCuentaService],
})
export class ElementosGastosFormComponent implements OnInit, AfterViewInit {
    action: ActionClicked;

    fg: FormGroup;

    tipoEntidadValues: SelectItem[] = [];
    cuentasValues: SelectItem[] = [];
    epigrafesValues: SelectItem[] = [];

    constructor(
        private _elementoGastoSvc: ElementosGastosService,
        private _tipoEntidadesSvc: TipoEntidadesService,
        private _epigrafesSvc: EpigrafesService,
        private _clasificadorCuentaSvc: ClasificadorCuentaService,
        private _dinamicDialogSvc: DinamicDialogService
    ) {}

    ngOnInit(): void {
        this.fg = this._elementoGastoSvc.fg;

        this.action =
            this.fg.controls['elemento'].value === ''
                ? ActionClicked.Add
                : ActionClicked.Edit;
    }

    ngAfterViewInit(): void {
        this._loadTipoEntidades();
        this._loadEpigrafes();
        this._loadCuentas();
    }

    private _loadTipoEntidades(): void {
        try {
            this._elementoGastoSvc.subscription.push(
                this._tipoEntidadesSvc
                    .loadAllTipoEntidades()
                    .subscribe(response => {
                        const result = response.getAllTipoEntidades;
                        if (result.success) {
                            this.tipoEntidadValues = result.data.map(
                                (tipo: { Id: any; Entidades: any }) => {
                                    return {
                                        value: tipo.Id,
                                        label: tipo.Entidades,
                                    };
                                }
                            );
                        }
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

    private _loadEpigrafes(): void {
        try {
            this._elementoGastoSvc.subscription.push(
                this._epigrafesSvc.loadAllEpigrafes().subscribe(response => {
                    const result = response.getAllEpigrafes;
                    if (result.success) {
                        this.epigrafesValues = result.data.map(
                            (epigrafe: { IdEpigafre: any; Epigrafe: any }) => {
                                return {
                                    value: epigrafe.IdEpigafre,
                                    label: epigrafe.Epigrafe,
                                };
                            }
                        );
                    }
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

    private _loadCuentas(): void {
        try {
            this._elementoGastoSvc.subscription.push(
                this._clasificadorCuentaSvc
                    .loadCuentasAgrupadas()
                    .subscribe(res => {
                        const result = res.getCuentasAgrupadas;
                        if (!result.success) {
                            return SweetAlert.fire({
                                icon: 'error',
                                title: 'ERROR',
                                text: result.error,
                                confirmButtonText: 'Aceptar',
                            });
                        }

                        this.cuentasValues = res.getCuentasAgrupadas.data.map(
                            (cuenta: { Cuenta: any }) => {
                                return {
                                    value: cuenta.Cuenta,
                                    label: cuenta.Cuenta,
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
            this._elementoGastoSvc.save().subscribe(response => {
                let result;

                result = response.saveElementoGasto;
                if (!result.success) {
                    return SweetAlert.fire({
                        icon: 'error',
                        title: 'ERROR',
                        text: result.error,
                        showConfirmButton: true,
                        confirmButtonText: 'Aceptar',
                    });
                }

                let txtMessage;
                if (this.action === ActionClicked.Add) {
                    txtMessage =
                        'El Elemento de Gasto se ha creado correctamente.';
                } else {
                    txtMessage =
                        'El Elemento de Gasto se ha actualizado correctamente.';
                }

                this._closeModal(txtMessage);
            });
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
        this._dinamicDialogSvc.close(message);
    }
}
