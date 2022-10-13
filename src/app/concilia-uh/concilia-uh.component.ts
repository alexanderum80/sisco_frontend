import { ConciliaUhService } from './shared/services/concilia-uh.service';
import { cloneDeep } from 'lodash';
import { SweetalertService } from './../shared/services/sweetalert.service';
import { PdfmakeService } from './../shared/services/pdfmake.service';
import { ClasificadorEntidadesService } from './../clasificador-entidades/shared/services/clasificador-entidades.service';
import { TipoEntidadesService } from './../tipo-entidades/shared/services/tipo-entidades.service';
import { UnidadesService } from './../unidades/shared/services/unidades.service';
import { FormGroup } from '@angular/forms';
import { ConciliaUH } from './shared/models/concilia-uh.model';
import { SelectItem } from 'primeng/api';
import { ITableColumns } from './../shared/ui/prime-ng/table/table.model';
import {
    Component,
    OnInit,
    ChangeDetectorRef,
    AfterViewInit,
    OnDestroy,
} from '@angular/core';

@Component({
    selector: 'app-concilia-uh',
    templateUrl: './concilia-uh.component.html',
    styleUrls: ['./concilia-uh.component.scss'],
})
export class ConciliaUhComponent implements OnInit, AfterViewInit, OnDestroy {
    displayedColumnsInventario: ITableColumns[] = [
        { header: 'Cuenta', field: 'Cuenta', type: 'string' },
        { header: 'SubCuenta', field: 'SubCuenta', type: 'string' },
        { header: 'Análisis 1', field: 'Analisis1', type: 'string' },
        { header: 'Análisis 2', field: 'Analisis2', type: 'string' },
        { header: 'Análisis 3', field: 'Analisis3', type: 'string' },
        {
            header: 'Saldo Inventario',
            field: 'SaldoUH',
            type: 'decimal',
            totalize: true,
        },
        {
            header: 'Saldo Rodas',
            field: 'SaldoRodas',
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

    displayedColumnsDesgaste: ITableColumns[] = [
        { header: 'Cuenta', field: 'Cuenta', type: 'string' },
        { header: 'SubCuenta', field: 'SubCuenta', type: 'string' },
        { header: 'Análisis 1', field: 'Analisis1', type: 'string' },
        { header: 'Análisis 2', field: 'Analisis2', type: 'string' },
        { header: 'Análisis 3', field: 'Analisis3', type: 'string' },
        {
            header: 'Saldo Depreciación',
            field: 'SaldoUH',
            type: 'decimal',
            totalize: true,
        },
        {
            header: 'Saldo Rodas',
            field: 'SaldoRodas',
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

    centrosValues: SelectItem[] = [];
    tipoEntidadValues: SelectItem[] = [];

    dataSourceConciliacion: ConciliaUH[] = [];
    dataSourceInventario: ConciliaUH[] = [];
    dataSourceDesgaste: ConciliaUH[] = [];

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
        private _conciliaUhSvc: ConciliaUhService,
        private _pdfMakeSvc: PdfmakeService,
        private _changeDedectionRef: ChangeDetectorRef,
        private _swalSvc: SweetalertService
    ) {}

    ngOnInit(): void {
        this.fg = this._conciliaUhSvc.fg;
        this._conciliaUhSvc.inicializarFg();
        this._subscribeToFgValueChanges();

        this._changeDedectionRef.detectChanges();
    }

    ngAfterViewInit(): void {
        this._getUnidades();
        this._getTipoEntidades();
    }

    ngOnDestroy(): void {
        this._conciliaUhSvc.dispose();
    }

    private _subscribeToFgValueChanges(): void {
        this._conciliaUhSvc.subscription.push(
            this.fg.valueChanges.subscribe(() => {
                this._inicializarDatos();
            })
        );

        // IdCentro
        this._conciliaUhSvc.subscription.push(
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
        this.dataSourceDesgaste = [];
    }

    private _getUnidades(): void {
        try {
            this._conciliaUhSvc.subscription.push(
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
            this._conciliaUhSvc.subscription.push(
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
        this._conciliaUhSvc.subscription.push(
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

            this._conciliaUhSvc.subscription.push(
                this._conciliaUhSvc.conciliar().subscribe({
                    next: response => {
                        this.loading = false;

                        this.dataSourceConciliacion = cloneDeep(
                            response.conciliaUH || []
                        );
                        this.dataSourceInventario = this.dataSourceConciliacion
                            ? cloneDeep(
                                  this.dataSourceConciliacion.filter(
                                      r => r.Tipo === 'Inventario'
                                  )
                              )
                            : [];
                        this.dataSourceDesgaste = this.dataSourceConciliacion
                            ? cloneDeep(
                                  this.dataSourceConciliacion.filter(
                                      r => r.Tipo === 'Desgaste'
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
        this._reporteConcilia();
    }

    private async _reporteConcilia(): Promise<any> {
        try {
            const documentDefinitions = {
                pageSize: 'LETTER',
                // pageOrientation: 'landscape',
                content: [
                    await this._pdfMakeSvc.getHeaderDefinition(
                        'Conciliación Rodas vs Útiles y Herramientas'
                    ),
                    await this._pdfMakeSvc.getPeriodoDefinition(
                        this.fg.controls['periodo'].value
                    ),
                    await this._conciliaUhSvc.getConciliacionDefinition(
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

    handleTabViewChange(event: any): void {
        try {
            this.selectedTabViewIndex = event.index;
        } catch (err: any) {
            this._swalSvc.error(err);
        }
    }
}
