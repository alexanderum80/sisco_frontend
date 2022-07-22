import { cloneDeep } from 'lodash';
import {
    IConciliaAFT,
    IDiferenciaClasificadorCNMB,
} from './shared/models/concilia-aft.model';
import { ConciliaAftService } from './shared/services/concilia-aft.service';
import { SweetalertService } from './../shared/services/sweetalert.service';
import { PdfmakeService } from './../shared/services/pdfmake.service';
import { ClasificadorEntidadesService } from './../clasificador-entidades/shared/services/clasificador-entidades.service';
import { TipoEntidadesService } from './../tipo-entidades/shared/services/tipo-entidades.service';
import { UnidadesService } from './../unidades/shared/services/unidades.service';
import { FormGroup } from '@angular/forms';
import { ITableColumns } from 'src/app/shared/ui/prime-ng/table/table.model';
import { SelectItem } from 'primeng/api';
import {
    Component,
    OnInit,
    ChangeDetectorRef,
    AfterViewInit,
    OnDestroy,
} from '@angular/core';

@Component({
    selector: 'app-concilia-aft',
    templateUrl: './concilia-aft.component.html',
    styleUrls: ['./concilia-aft.component.scss'],
})
export class ConciliaAftComponent implements OnInit, AfterViewInit, OnDestroy {
    displayedColumnsInventario: ITableColumns[] = [
        { header: 'Cuenta', field: 'Cta', type: 'string' },
        { header: 'SubCuenta', field: 'Scta', type: 'string' },
        { header: 'Análisis 1', field: 'An1', type: 'string' },
        { header: 'Análisis 2', field: 'An2', type: 'string' },
        { header: 'Análisis 3', field: 'An3', type: 'string' },
        {
            header: 'Saldo Inventario',
            field: 'Saldo_AF',
            type: 'decimal',
            totalize: true,
        },
        {
            header: 'Saldo Rodas',
            field: 'Saldo_Rodas',
            type: 'decimal',
            totalize: true,
        },
        {
            header: 'Diferencia',
            field: 'Diferencia',
            type: 'decimal',
            totalize: true,
        },
    ];

    displayedColumnsDepreciacion: ITableColumns[] = [
        { header: 'Cuenta', field: 'Cta', type: 'string' },
        { header: 'SubCuenta', field: 'Scta', type: 'string' },
        { header: 'Análisis 1', field: 'An1', type: 'string' },
        { header: 'Análisis 2', field: 'An2', type: 'string' },
        { header: 'Análisis 3', field: 'An3', type: 'string' },
        {
            header: 'Saldo Depreciación',
            field: 'Saldo_AF',
            type: 'decimal',
            totalize: true,
        },
        {
            header: 'Saldo Rodas',
            field: 'Saldo_Rodas',
            type: 'decimal',
            totalize: true,
        },
        {
            header: 'Diferencia',
            field: 'Diferencia',
            type: 'decimal',
            totalize: true,
        },
    ];

    displayedColumnsClasificador: ITableColumns[] = [
        { header: 'Unidad', field: 'Unidad', type: 'string' },
        { header: 'CNMB', field: 'CNMB', type: 'string' },
        { header: 'Descripción', field: 'DCNMB', type: 'string' },
        { header: 'Tasa Clasificador', field: 'TREPO', type: 'decimal' },
        { header: 'Tasa Unidad', field: 'TREPO_UC', type: 'decimal' },
    ];

    centrosValues: SelectItem[] = [];
    tipoEntidadValues: SelectItem[] = [];

    dataSourceConciliacion: IConciliaAFT[] = [];
    dataSourceInventario: IConciliaAFT[] = [];
    dataSourceDepreciacion: IConciliaAFT[] = [];
    dataSourceClasificador: IDiferenciaClasificadorCNMB[] = [];

    totalInvAft = 0;
    totalInvRodas = 0;
    totalInvDif = 0;

    totalDepAft = 0;
    totalDepRodas = 0;
    totalDepDif = 0;

    loading = false;
    selectedTabViewIndex = 0;

    tipoCentrosValues: SelectItem[] = [
        { value: '0', label: 'Centro' },
        { value: '2', label: 'Consolidado' },
    ];

    fg: FormGroup;

    myDatepicker: any;

    constructor(
        private _unidadesSvc: UnidadesService,
        private _tipoEntidadesSvc: TipoEntidadesService,
        private _clasifEntidadesSvc: ClasificadorEntidadesService,
        private _conciliaAftSvc: ConciliaAftService,
        private _pdfMakeSvc: PdfmakeService,
        private _changeDedectionRef: ChangeDetectorRef,
        private _swalSvc: SweetalertService
    ) {}

    ngOnInit(): void {
        this.fg = this._conciliaAftSvc.fg;
        this._conciliaAftSvc.inicializarFg();
        this._subscribeToFgValueChanges();

        this._changeDedectionRef.detectChanges();
    }

    ngAfterViewInit(): void {
        this._getUnidades();
        this._getTipoEntidades();
    }

    ngOnDestroy(): void {
        this._conciliaAftSvc.dispose();
    }

    private _subscribeToFgValueChanges(): void {
        this._conciliaAftSvc.subscription.push(
            this.fg.valueChanges.subscribe(() => {
                this._inicializarDatos();
            })
        );

        // IdCentro
        this._conciliaAftSvc.subscription.push(
            this.fg.controls['idCentro'].valueChanges.subscribe(value => {
                if (value) {
                    this._updateTipoEntidad(value);
                } else {
                    this.fg.controls['tipoEntidad'].setValue('');
                }
            })
        );
    }

    private _inicializarDatos(): void {
        this.dataSourceConciliacion = [];
        this.dataSourceInventario = [];
        this.dataSourceDepreciacion = [];
        this.dataSourceClasificador = [];
    }

    private _getUnidades(): void {
        try {
            this._conciliaAftSvc.subscription.push(
                this._unidadesSvc.getAllUnidades().subscribe(response => {
                    const result = response.getAllUnidades;

                    if (!result.success) {
                        this._swalSvc.error(result.error);
                        return;
                    }

                    this.centrosValues = result.data.map(
                        (u: { IdUnidad: string; Nombre: string }) => {
                            return {
                                value: u.IdUnidad,
                                label: u.IdUnidad + '-' + u.Nombre,
                            };
                        }
                    );
                })
            );
        } catch (err: any) {
            this._swalSvc.error(err);
        }
    }

    private _getTipoEntidades(): void {
        try {
            this._conciliaAftSvc.subscription.push(
                this._tipoEntidadesSvc
                    .loadAllTipoEntidades()
                    .subscribe(response => {
                        const result = response.getAllTipoEntidades;

                        if (!result.success) {
                            this._swalSvc.error(result.error);
                            return;
                        }

                        this.tipoEntidadValues = result.data.map(
                            (t: { Id: any; Entidades: any }) => {
                                return {
                                    value: t.Id,
                                    label: t.Entidades,
                                };
                            }
                        );
                    })
            );
        } catch (err: any) {
            this._swalSvc.error(err);
        }
    }

    private _updateTipoEntidad(idUnidad: number): void {
        this._conciliaAftSvc.subscription.push(
            this._clasifEntidadesSvc
                .loadClasificadorEntidad(idUnidad)
                .subscribe(response => {
                    const result = response.getClasificadorEntidad;

                    if (!result.success) {
                        this._swalSvc.error(result.error);
                        return;
                    }

                    this.fg.controls['tipoEntidad'].setValue(
                        result.data.IdTipoEntidad
                    );
                })
        );
    }

    conciliar(): void {
        try {
            this.loading = true;

            this._conciliaAftSvc.subscription.push(
                this._conciliaAftSvc.conciliar().subscribe({
                    next: response => {
                        this.loading = false;

                        this.dataSourceClasificador =
                            cloneDeep(
                                response.conciliaAFT.DiferenciaClasificadorCNMB
                            ) || [];

                        if (this.dataSourceClasificador.length) {
                            return this._swalSvc.error(
                                `Usted tiene errores en el clasificador, lo que conlleva a que no pueda terminar el análisis. Corrija estos errores.
                                Vaya a la pestaña Análisis del Clasificador para ver las diferencias.`
                            );
                        }

                        this.dataSourceConciliacion = cloneDeep(
                            response.conciliaAFT.ConciliaAFT || []
                        );
                        this.dataSourceInventario = this.dataSourceConciliacion
                            ? cloneDeep(
                                  this.dataSourceConciliacion.filter(
                                      r => r.Tipo === 'Inventario'
                                  )
                              )
                            : [];
                        this.dataSourceDepreciacion = this
                            .dataSourceConciliacion
                            ? cloneDeep(
                                  this.dataSourceConciliacion.filter(
                                      r => r.Tipo === 'Depreciación'
                                  )
                              )
                            : [];
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

    reporte(): void {
        switch (this.selectedTabViewIndex) {
            case 3:
                this._reporteDiferenciaClasificador();
                break;
            default:
                this._reporteConcilia();
                break;
        }
    }

    private async _reporteConcilia(): Promise<any> {
        try {
            const documentDefinitions = {
                pageSize: 'LETTER',
                // pageOrientation: 'landscape',
                content: [
                    await this._pdfMakeSvc.getHeaderDefinition(
                        'Conciliación Rodas vs Activos Fijos'
                    ),
                    await this._pdfMakeSvc.getPeriodoDefinition(
                        this.fg.controls['periodo'].value
                    ),
                    await this._conciliaAftSvc.getConciliacionDefinition(
                        this.dataSourceConciliacion,
                        this.fg.controls['tipoCentro'].value
                    ),
                ],
                footer: (page: string, pages: string) => {
                    return this._pdfMakeSvc.getFooterDefinition(page, pages);
                },
                defaultStyle: {
                    fontSize: 9,
                },
                styles: {
                    tableHeader: {
                        bold: true,
                    },
                },
            };

            this._pdfMakeSvc.generatePdf(documentDefinitions);
        } catch (err: any) {
            this._swalSvc.error(err);
        }
    }

    private async _reporteDiferenciaClasificador(): Promise<any> {
        try {
            const documentDefinitions = {
                pageSize: 'LETTER',
                // pageOrientation: 'landscape',
                content: [
                    await this._pdfMakeSvc.getHeaderDefinition(
                        'Diferencias en el Clasificador CNMB'
                    ),
                    await this._pdfMakeSvc.getPeriodoDefinition(
                        this.fg.controls['periodo'].value
                    ),
                    await this._conciliaAftSvc.getClasificadorDefinition(
                        this.dataSourceClasificador
                    ),
                ],
                footer: (page: string, pages: string) => {
                    return this._pdfMakeSvc.getFooterDefinition(page, pages);
                },
                defaultStyle: {
                    fontSize: 9,
                },
                styles: {
                    tableHeader: {
                        bold: true,
                    },
                },
            };

            this._pdfMakeSvc.generatePdf(documentDefinitions);
        } catch (err: any) {
            this._swalSvc.error(err);
        }
    }

    handleTabViewChange(event: any): void {
        try {
            this.selectedTabViewIndex = event.index;
        } catch (err: any) {
            this._swalSvc.error(err);
        }
    }
}
