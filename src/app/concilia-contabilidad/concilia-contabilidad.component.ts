import { ActionClicked } from './../shared/models/list-items';
import { SweetalertService } from './../shared/services/sweetalert.service';
import { ClasificadorEntidadesService } from './../clasificador-entidades/shared/services/clasificador-entidades.service';
import { TipoEntidadesService } from './../tipo-entidades/shared/services/tipo-entidades.service';
import { PdfmakeService } from './../shared/services/pdfmake.service';
import { ConciliaContabilidadService } from './shared/services/concilia-contabilidad.service';
import { UnidadesService } from './../unidades/shared/services/unidades.service';
import { FormGroup } from '@angular/forms';
import {
    Component,
    OnInit,
    ViewChild,
    ChangeDetectorRef,
    OnDestroy,
    AfterViewInit,
} from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { ITableColumns } from '../shared/ui/prime-ng/table/table.model';
import { cloneDeep } from '@apollo/client/utilities';
import { TabView } from 'primeng/tabview';
import { toNumber } from 'lodash';
import { SubdivisionesService } from '../shared/services/subdivisiones.service';
import { DivisionesService } from '../shared/services/divisiones.service';
import { TableService } from '../shared/ui/prime-ng/table/table.service';

const DISPLAYED_COLUMNS_CONSULTAS: ITableColumns[] = [
    { header: 'Cuenta', field: 'Cuenta', type: 'string' },
    { header: 'SubCuenta', field: 'SubCuenta', type: 'string' },
    { header: 'Análisis 1', field: 'Analisis1', type: 'string' },
    { header: 'Análisis 2', field: 'Analisis2', type: 'string' },
    { header: 'Análisis 3', field: 'Analisis3', type: 'string' },
    { header: 'Total', field: 'Total', type: 'decimal' },
];

@Component({
    selector: 'app-concilia-contabilidad',
    templateUrl: './concilia-contabilidad.component.html',
    styleUrls: ['./concilia-contabilidad.component.scss'],
})
export class ConciliaContabilidadComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(TabView) tabView: TabView;

    centrosValues: SelectItem[] = [];
    tipoEntidadValues: SelectItem[] = [];

    displayedColumnsConciliacion = DISPLAYED_COLUMNS_CONSULTAS;
    displayedColumnsExpresiones: ITableColumns[] = [
        { header: 'Expresión', field: 'Expresion', type: 'string' },
        { header: 'Valor', field: 'Valor', type: 'decimal' },
        { header: 'Operador', field: 'Operador', type: 'string' },
        { header: 'Expresión', field: 'ExpresionC', type: 'string' },
        { header: 'Valor', field: 'ValorC', type: 'decimal' },
        { header: 'Resultado', field: 'Resultado', type: 'string' },
    ];
    displayedColumnsValores: ITableColumns[] = [
        { header: 'Expresión', field: 'Expresion', type: 'string' },
        { header: 'Valor', field: 'Valor', type: 'decimal' },
        { header: 'Operador', field: 'Operador', type: 'string' },
        { header: 'Valor Rodas', field: 'ValorRodas', type: 'decimal' },
        { header: 'Estado', field: 'Estado', type: 'string' },
    ];
    displayedColumnsClasificador: ITableColumns[] = [
        { header: 'Cuenta', field: 'Cuenta', type: 'string' },
        { header: 'SubCuenta', field: 'SubCuenta', type: 'string' },
        { header: 'Descripción', field: 'Descripcion', type: 'string' },
        { header: 'Crit1 Clasif', field: 'Crt1Clasif', type: 'string' },
        { header: 'Crit1 Rodas', field: 'Crt1Rodas', type: 'string' },
        { header: 'Crit2 Clasif', field: 'Crt2Clasif', type: 'string' },
        { header: 'Crit2 Rodas', field: 'Crt2Rodas', type: 'string' },
        { header: 'Crit3 Clasif', field: 'Crt3Clasif', type: 'string' },
        { header: 'Crit3 Rodas', field: 'Crt3Rodas', type: 'string' },
        { header: 'Nat Clasif', field: 'NatClasif', type: 'string' },
        { header: 'Nat Rodas', field: 'NatRodas', type: 'string' },
        { header: 'Obl Clasif', field: 'OblClasif', type: 'boolean' },
        { header: 'Obl Rodas', field: 'OblRodas', type: 'boolean' },
        { header: 'Term Clasf', field: 'TermClasf', type: 'boolean' },
        { header: 'Term Rodas', field: 'TermRodas', type: 'boolean' },
        {
            header: 'Crit1 Cons Clasif',
            field: 'Crit1ConsClasif',
            type: 'string',
        },
        { header: 'Crit1 Cons Rodas', field: 'Crit1ConsRodas', type: 'string' },
        {
            header: 'Crit2 Cons Clasif',
            field: 'Crit2ConsClasif',
            type: 'string',
        },
        { header: 'Crit2 Cons Rodas', field: 'Crit2ConsRodas', type: 'string' },
        {
            header: 'Crit3 Cons Clasif',
            field: 'Crit3ConsClasif',
            type: 'string',
        },
        { header: 'Crit3 Cons Rodas', field: 'Crit3ConsRodas', type: 'string' },
    ];
    displayedColumnsCentrosSubordinados: ITableColumns[] = [
        { header: 'Centro', field: 'Nombre', type: 'string' },
    ];
    displayedColumnsChequeo: ITableColumns[] = [
        { header: 'Cuenta', field: 'Cuenta', type: 'string' },
        { header: 'SubCuenta', field: 'SubCuenta', type: 'string' },
        { header: 'Análisis 1', field: 'Analisis1', type: 'string' },
        { header: 'Análisis 2', field: 'Analisis2', type: 'string' },
        { header: 'Análisis 3', field: 'Analisis3', type: 'string' },
        { header: 'Total', field: 'Total', type: 'decimal' },
    ];

    dataSourceAsientos = [];
    dataSourceExpresiones = [];
    dataSourceValores = [];
    dataSourceClasificador = [];
    dataSourceCentrosSubordinados = [];
    dataSourceChequeo = [];

    isConsolidado = false;
    loading = false;
    chequeoCentro = false;

    selectedTabViewIndex = 0;

    tipoCentrosValues: SelectItem[] = [
        { value: '0', label: 'Centro' },
        { value: '1', label: 'Complejo' },
        { value: '2', label: 'Consolidado' },
    ];

    fg: FormGroup;

    myDatepicker: any;

    buttonConciliarItems: MenuItem[] = [
        {
            id: 'inicializar',
            label: 'Inicializar Datos',
            icon: 'mdi mdi-restart',
            command: () => {
                this._iniciarSaldos();
            },
        },
    ];

    constructor(
        private _unidadesSvc: UnidadesService,
        private _subdivisionesSvc: SubdivisionesService,
        private _divisionesSvc: DivisionesService,
        private _tipoEntidadesSvc: TipoEntidadesService,
        private _clasifEntidadesSvc: ClasificadorEntidadesService,
        private _conciliaContabSvc: ConciliaContabilidadService,
        private _pdfMakeSvc: PdfmakeService,
        private _tableSvc: TableService,
        private _changeDedectionRef: ChangeDetectorRef,
        private _swalSvc: SweetalertService
    ) {}

    ngOnInit(): void {
        this.fg = this._conciliaContabSvc.fg;
        this._conciliaContabSvc.inicializarFg();
        this._subscribeToFgValueChanges();

        this._changeDedectionRef.detectChanges();
    }

    ngAfterViewInit(): void {
        this._getUnidades();
        this._getTipoEntidades();
    }

    ngOnDestroy(): void {
        this._conciliaContabSvc.dispose();
    }

    private _subscribeToFgValueChanges(): void {
        this._conciliaContabSvc.subscription.push(
            this.fg.valueChanges.subscribe(() => {
                this._inicializarDatos();
            })
        );

        // TipoCentro
        this._conciliaContabSvc.subscription.push(
            this.fg.controls['tipoCentro'].valueChanges.subscribe(value => {
                this.isConsolidado = value === '2';
                if (this.isConsolidado) {
                    this.fg.controls['tipoEntidad'].setValue(1);
                    this._getCentrosSubordinados(
                        toNumber(this.fg.get('idCentro')?.value)
                    );
                    this.buttonConciliarItems.unshift(
                        {
                            id: 'chequear',
                            label: 'Chequear Centros',
                            icon: 'mdi mdi-format-list-checks',
                            command: () => {
                                this._chequearCentros();
                            },
                        },
                        { id: 'chequear', separator: true }
                    );
                } else {
                    const idUnidad = this.fg.get('idCentro')?.value;
                    if (idUnidad) {
                        this._updateTipoEntidad(idUnidad);
                    } else {
                        this.fg.controls['tipoEntidad'].setValue('');
                    }
                    this.buttonConciliarItems =
                        this.buttonConciliarItems.filter(
                            b => b.id !== 'chequear'
                        );
                }
            })
        );

        // IdCentro
        this._conciliaContabSvc.subscription.push(
            this.fg.controls['idCentro'].valueChanges.subscribe(value => {
                if (this.fg.get('tipoCentro')?.value === '2') {
                    this.fg.controls['tipoEntidad'].setValue(1);
                    this._getCentrosSubordinados(toNumber(value));
                } else if (value) {
                    this._updateTipoEntidad(value);
                } else {
                    this.fg.controls['tipoEntidad'].setValue('');
                }
            })
        );

        // apertura
        this._conciliaContabSvc.subscription.push(
            this.fg.controls['apertura'].valueChanges.subscribe(value => {
                if (value) this.fg.controls['cierre'].setValue(false);
            })
        );

        // cierre
        this._conciliaContabSvc.subscription.push(
            this.fg.controls['cierre'].valueChanges.subscribe(value => {
                if (value) this.fg.controls['apertura'].setValue(false);
            })
        );
    }

    get isCierreOApertura(): boolean {
        return (
            this.fg.controls['apertura'].value ||
            this.fg.controls['cierre'].value
        );
    }

    private _inicializarDatos(): void {
        this.dataSourceAsientos = [];
        this.dataSourceExpresiones = [];
        this.dataSourceValores = [];
        this.dataSourceClasificador = [];
    }

    private _getUnidades(): void {
        try {
            this._conciliaContabSvc.subscription.push(
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

    private _getCentrosSubordinados(subordinadoA: number): void {
        try {
            this.dataSourceCentrosSubordinados = [];

            if (subordinadoA === 100) {
                this._conciliaContabSvc.subscription.push(
                    this._divisionesSvc.getDivisiones().subscribe(response => {
                        const result = response.getAllDivisiones;

                        if (!result.success) {
                            this._swalSvc.error(result.error);
                        }

                        this.dataSourceCentrosSubordinados = result.data.map(
                            (u: { IdDivision: string; Division: string }) => {
                                return {
                                    IdCentro: u.IdDivision,
                                    Nombre: u.IdDivision + '-' + u.Division,
                                };
                            }
                        );
                    })
                );
            } else {
                this._conciliaContabSvc.subscription.push(
                    this._subdivisionesSvc
                        .getSubdivisionesByIdDivision(subordinadoA)
                        .subscribe(response => {
                            const result =
                                response.getSubdivisionesByIdDivision;

                            if (!result.success) {
                                this._swalSvc.error(result.error);
                            }

                            this.dataSourceCentrosSubordinados =
                                result.data.map(
                                    (u: {
                                        IdSubdivision: string;
                                        Subdivision: string;
                                    }) => {
                                        return {
                                            IdCentro: u.IdSubdivision,
                                            Nombre:
                                                u.IdSubdivision +
                                                '-' +
                                                u.Subdivision,
                                        };
                                    }
                                );
                        })
                );
            }
        } catch (err: any) {
            this._swalSvc.error(err);
        }
    }

    private _getTipoEntidades(): void {
        try {
            this._conciliaContabSvc.subscription.push(
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
        this._conciliaContabSvc.subscription.push(
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
            this.chequeoCentro = false;

            this._conciliaContabSvc.subscription.push(
                this._conciliaContabSvc.conciliar().subscribe(response => {
                    this.loading = false;

                    const result = response.conciliaContabilidad;

                    if (!result.success) {
                        this._swalSvc.error(result.error);
                    }

                    this.dataSourceClasificador =
                        JSON.parse(result.data.ReporteClasificador.data) || [];
                    this.dataSourceAsientos =
                        cloneDeep(
                            JSON.parse(result.data.ReporteConsultas.data)
                        ) || [];
                    this.dataSourceExpresiones =
                        cloneDeep(
                            JSON.parse(result.data.ReporteExpresiones.data)
                        ) || [];
                    this.dataSourceValores =
                        cloneDeep(
                            JSON.parse(result.data.ReporteValores.data)
                        ) || [];
                })
            );
        } catch (err: any) {
            this.loading = false;

            this._swalSvc.error(err);
        }
    }

    private _iniciarSaldos(): void {
        try {
            this._swalSvc
                .question('¿Desea Iniciar los Saldos del Centro seleccionado?')
                .then(res => {
                    if (res === ActionClicked.Yes) {
                        this.loading = true;
                        this._conciliaContabSvc.subscription.push(
                            this._conciliaContabSvc
                                .iniciarSaldo()
                                .subscribe(response => {
                                    this.loading = false;
                                    const result = response.iniciarSaldos;

                                    if (result.success) {
                                        this._swalSvc.success(
                                            'Saldos Iniciados Correctamente.'
                                        );
                                    } else {
                                        this._swalSvc.error(result.error);
                                    }
                                })
                        );
                    }
                });
        } catch (err: any) {
            this.loading = false;
            this._swalSvc.error(err);
        }
    }

    private _chequearCentros(): void {
        try {
            if (!this._tableSvc.selectedRow.length) {
                this._swalSvc.error(
                    'Debe seleccionar al menos 1 Centro a Chequear.'
                );
                return;
            }

            this.selectedTabViewIndex = 0;
            this.loading = true;
            this.chequeoCentro = true;
            this.dataSourceChequeo = [];

            const centrosAChequear = this._tableSvc.selectedRow.map(row => {
                return row.IdCentro;
            });

            this._conciliaContabSvc.subscription.push(
                this._conciliaContabSvc
                    .chequearCentros(centrosAChequear)
                    .subscribe(response => {
                        this.loading = false;
                        const result = response.chequearCentros;

                        if (!result?.success) {
                            this._swalSvc.error(result.error);
                            return;
                        }

                        this.dataSourceChequeo = JSON.parse(result.data || '');
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
                if (this.chequeoCentro) {
                    this._reporteChequeo();
                } else {
                    this._reporteConcilia();
                }
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
                        'Certificación para la entrega de los Estados Financieros'
                    ),
                    await this._pdfMakeSvc.getPeriodoDefinition(
                        this.fg.controls['periodo'].value
                    ),
                    await this._conciliaContabSvc.getCentro(
                        this.fg.get('idCentro')?.value,
                        this.centrosValues
                    ),
                    await this._conciliaContabSvc.getTipoEntidad(
                        this.fg.get('tipoEntidad')?.value,
                        this.tipoEntidadValues
                    ),
                    await this._conciliaContabSvc.getReporteAsientoDefinition(
                        this.dataSourceAsientos
                    ),
                    await this._conciliaContabSvc.getReporteExpresionesDefinition(
                        this.dataSourceExpresiones
                    ),
                    await this._conciliaContabSvc.getReporteValoresDefinition(
                        this.dataSourceValores
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

    private async _reporteChequeo(): Promise<any> {
        try {
            const documentDefinitions = {
                pageSize: 'LETTER',
                // pageOrientation: 'landscape',
                content: [
                    await this._pdfMakeSvc.getHeaderDefinition(
                        'Chequeo de Centros vs Consolidado'
                    ),
                    await this._pdfMakeSvc.getPeriodoDefinition(
                        this.fg.controls['periodo'].value
                    ),
                    await this._conciliaContabSvc.getConsolidado(
                        this.fg.get('idCentro')?.value,
                        this.centrosValues
                    ),
                    await this._conciliaContabSvc.getReporteChequeoDefinition(
                        this.dataSourceChequeo
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
                pageOrientation: 'landscape',
                content: [
                    await this._pdfMakeSvc.getHeaderDefinition(
                        'Diferencias entre el Clasificador y el Clasificador del Rodas'
                    ),
                    await this._pdfMakeSvc.getPeriodoDefinition(
                        this.fg.controls['periodo'].value
                    ),
                    await this._conciliaContabSvc.getCentro(
                        this.fg.get('idCentro')?.value,
                        this.centrosValues
                    ),
                    await this._conciliaContabSvc.getReporteDiferenciaClasificadorDefinition(
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
