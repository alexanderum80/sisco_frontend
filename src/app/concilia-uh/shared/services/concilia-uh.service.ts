import { numberFormatter } from './../../../shared/models/number';
import { conciliaUhApi } from './../graphql/concilia-uh.actions';
import { toNumber } from 'lodash';
import {
    ConciliaUH,
    ConciliaUHQueryResponse,
} from './../models/concilia-uh.model';
import { SelectItem } from 'primeng/api';
import { ApolloService } from './../../../shared/services/apollo.service';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root',
})
export class ConciliaUhService {
    fg: FormGroup = new FormGroup({
        tipoCentro: new FormControl('0'),
        idCentro: new FormControl(''),
        tipoEntidad: new FormControl(''),
        periodo: new FormControl(''),
        nota: new FormControl(''),
    });

    subscription: Subscription[] = [];

    constructor(private _apolloSvc: ApolloService) {}

    inicializarFg() {
        const today = new Date();
        const fgValues = {
            tipoCentro: '0',
            idCentro: null,
            tipoEntidad: null,
            periodo: new Date(today.getFullYear(), today.getMonth(), 0),
            nota: '',
        };

        this.fg.patchValue(fgValues);
    }

    public async getCentro(
        idUnidad: number,
        unidadesList: SelectItem[]
    ): Promise<any> {
        const definition = [];

        const _unidad = unidadesList.find(u => u.value === idUnidad);

        definition.push({
            text: `Centro:  ${_unidad?.label} `,
            bold: true,
            margin: [0, 5, 0, 0],
        });

        return definition;
    }

    public async getConsolidado(
        idUnidad: number,
        unidadesList: SelectItem[]
    ): Promise<any> {
        const definition = [];

        const _unidad = unidadesList.find(u => u.value === idUnidad);

        definition.push({
            text: `Consolidado:  ${_unidad?.label} `,
            bold: true,
            margin: [0, 5, 0, 0],
        });

        return definition;
    }

    public async getTipoEntidad(
        tipoCentro: number,
        tipoCentrosList: SelectItem[]
    ): Promise<any> {
        const definition = [];

        const _unidad = tipoCentrosList.find(u => u.value === tipoCentro);

        definition.push({
            text: `Tipo de Contabilidad:  ${_unidad?.label} `,
            bold: true,
            margin: [0, 5, 0, 0],
        });

        return definition;
    }

    public conciliar(): Observable<ConciliaUHQueryResponse> {
        let periodo = toNumber(
            moment(this.fg.controls['periodo'].value).format('MM')
        );

        const conciliaUhInput = {
            idCentro: toNumber(this.fg.controls['idCentro'].value),
            periodo: periodo,
            annio: toNumber(
                moment(this.fg.controls['periodo'].value).format('YYYY')
            ),
        };

        return new Observable<ConciliaUHQueryResponse>(subscriber => {
            this._apolloSvc
                .query<ConciliaUHQueryResponse>(conciliaUhApi.concilia, {
                    conciliaUhInput,
                })
                .subscribe({
                    next: response => {
                        subscriber.next(response);
                    },
                    error: err => {
                        subscriber.error(err);
                    },
                });
        });
    }

    public async getConciliacionDefinition(
        conciliaData: any,
        tipoCentro: string
    ): Promise<any> {
        const _conciliaData = await this.getFormattedConcilia(
            conciliaData,
            tipoCentro
        );

        const definition: any[] = [];
        const tipos = ['Inventario', 'Desgaste'];

        const groupData = _conciliaData.filter(
            (d: { IsGroupBy: any }) => d.IsGroupBy
        );

        groupData.forEach((element: any) => {
            if (element.Field) {
                definition.push({
                    text: element.Field + ': ' + element.Value,
                    bold: true,
                    margin: [0, 10, 0, 0],
                });
            }

            switch (tipoCentro) {
                case '0':
                    tipos.forEach(tipo => {
                        const data = _conciliaData.filter(
                            (f: any) =>
                                f.IdUnidad === element.IdUnidad &&
                                f.Tipo === tipo &&
                                !f.IsGroupBy
                        );

                        if (data.length) {
                            definition.push({
                                text: tipo,
                                alignment: 'center',
                                bold: true,
                                margin: [0, 5, 0, 0],
                            });

                            definition.push(
                                this._getConciliacionTable(data, tipoCentro)
                            );
                        }
                    });
                    break;
                case '1':
                    tipos.forEach(tipo => {
                        const data = _conciliaData.filter(
                            (f: any) =>
                                f.IdDivision === element.IdDivision &&
                                f.Tipo === tipo &&
                                !f.IsGroupBy
                        );

                        if (data.length) {
                            definition.push({
                                text: tipo,
                                alignment: 'center',
                                bold: true,
                                margin: [0, 5, 0, 0],
                            });

                            definition.push(
                                this._getConciliacionTable(data, tipoCentro)
                            );
                        }
                    });
                    break;
            }
        });

        return definition;
    }

    public async getClasificadorDefinition(clasifData: any): Promise<any> {
        const _clasifData = await this.getFormattedClasificador(clasifData);

        const definition: any[] = [];

        const groupData = _clasifData.filter((d: any) => d.IsGroupBy);

        groupData.forEach((element: any) => {
            if (element.Field) {
                definition.push({
                    text: element.Field + ': ' + element.Value,
                    bold: true,
                    margin: [0, 5, 0, 0],
                });
            }

            const data = _clasifData.filter(
                (f: any) => f.IdUnidad === element.IdUnidad && !f.IsGroupBy
            );

            if (data.length) {
                definition.push(this._getClasificadorTable(data));
            }
        });

        return definition;
    }

    public async getFormattedConcilia(
        data: ConciliaUH[],
        tipoCentro: string
    ): Promise<any> {
        let _idDivision = 0;
        let _idCentro = 0;
        let _tipo = '';
        let _totalUH = 0;
        let _totalRodas = 0;
        let _totalDif = 0;

        const result = [];

        if (data && data.length) {
            data.forEach(element => {
                if (element.IdDivision !== _idDivision) {
                    result.push({
                        Tipo: element.Tipo,
                        Field: 'División',
                        Value: element.Division,
                        IdDivision: element.IdDivision,
                        IsGroupBy: true,
                    });
                    _idDivision = element.IdDivision;
                }
                if (
                    tipoCentro === '0' &&
                    (element.IdUnidad !== _idCentro || element.Tipo !== _tipo)
                ) {
                    if (
                        _idCentro !== 0 ||
                        (element.Tipo !== _tipo && _tipo !== '')
                    ) {
                        result.push({
                            Tipo: _tipo,
                            IdDivision: _idDivision,
                            IdUnidad: _idCentro,
                            Cuenta: 'TOTAL',
                            SubCuenta: '',
                            Analisis1: '',
                            Analisis2: '',
                            Analisis3: '',
                            SaldoUH: _totalUH,
                            SaldoRodas: _totalRodas,
                            Diferencia: _totalDif,
                        });

                        _totalUH = 0;
                        _totalRodas = 0;
                        _totalDif = 0;
                    }

                    if (element.IdUnidad !== _idCentro) {
                        result.push({
                            Tipo: element.Tipo,
                            Field: 'Unidad',
                            Value: element.Unidad,
                            IdUnidad: element.IdUnidad,
                            IsGroupBy: true,
                        });

                        _idCentro = element.IdUnidad;
                    }

                    result.push({
                        Tipo: element.Tipo,
                        IdDivision: element.IdDivision,
                        IdUnidad: element.IdUnidad,
                        Unidad: element.Unidad,
                        Cuenta: element.Cuenta,
                        SubCuenta: element.SubCuenta,
                        Analisis1: element.Analisis1,
                        Analisis2: element.Analisis2,
                        Analisis3: element.Analisis3,
                        SaldoUH: element.SaldoUH,
                        SaldoRodas: element.SaldoRodas,
                        Diferencia: element.Diferencia,
                    });

                    _totalUH += element.SaldoUH;
                    _totalRodas += element.SaldoRodas;
                    _totalDif += element.Diferencia;

                    _tipo = element.Tipo;
                } else if (
                    tipoCentro === '1' &&
                    (element.IdDivision !== _idDivision ||
                        element.Tipo !== _tipo)
                ) {
                    if (
                        _idCentro !== 0 ||
                        (element.Tipo !== _tipo && _tipo !== '')
                    ) {
                        result.push({
                            Tipo: _tipo,
                            IdDivision: _idDivision,
                            IdUnidad: _idCentro,
                            Cuenta: 'TOTAL',
                            SubCuenta: '',
                            Analisis1: '',
                            Analisis2: '',
                            Analisis3: '',
                            SaldoUH: _totalUH,
                            SaldoRodas: _totalRodas,
                            Diferencia: _totalDif,
                        });

                        _totalUH = 0;
                        _totalRodas = 0;
                        _totalDif = 0;
                    }

                    result.push({
                        Tipo: element.Tipo,
                        IdDivision: element.IdDivision,
                        IdUnidad: element.IdUnidad,
                        Unidad: element.Unidad,
                        Cuenta: element.Cuenta,
                        SubCuenta: element.SubCuenta,
                        Analisis1: element.Analisis1,
                        Analisis2: element.Analisis2,
                        Analisis3: element.Analisis3,
                        SaldoUH: element.SaldoUH,
                        SaldoRodas: element.SaldoRodas,
                        Diferencia: element.Diferencia,
                    });

                    _totalUH += element.SaldoUH;
                    _totalRodas += element.SaldoRodas;
                    _totalDif += element.Diferencia;

                    _tipo = element.Tipo;

                    if (element.IdDivision !== _idDivision) {
                        result.push({
                            Tipo: element.Tipo,
                            Field: 'División',
                            Value: element.Division,
                            IdDivision: element.IdDivision,
                            IsGroupBy: true,
                        });

                        _idDivision = element.IdDivision;
                    }
                } else {
                    result.push({
                        Tipo: element.Tipo,
                        IdDivision: element.IdDivision,
                        IdUnidad: element.IdUnidad,
                        Unidad: element.Unidad,
                        Cuenta: element.Cuenta,
                        SubCuenta: element.SubCuenta,
                        Analisis1: element.Analisis1,
                        Analisis2: element.Analisis2,
                        Analisis3: element.Analisis3,
                        SaldoUH: element.SaldoUH,
                        SaldoRodas: element.SaldoRodas,
                        Diferencia: element.Diferencia,
                    });

                    _totalUH += element.SaldoUH;
                    _totalRodas += element.SaldoRodas;
                    _totalDif += element.Diferencia;
                }
            });

            result.push({
                Tipo: _tipo,
                IdDivision: _idDivision,
                IdUnidad: _idCentro,
                Cuenta: 'TOTAL',
                SubCuenta: '',
                Analisis1: '',
                Analisis2: '',
                Analisis3: '',
                SaldoUH: _totalUH,
                SaldoRodas: _totalRodas,
                Diferencia: _totalDif,
            });
        }

        return result;
    }

    private _getConciliacionTable(
        data: ConciliaUH[],
        tipoCentro: string
    ): object {
        let returnValue = {};

        switch (tipoCentro) {
            case '0':
                returnValue = {
                    table: {
                        widths: [40, 50, 40, 40, 40, '*', '*', '*'],
                        body: [
                            [
                                {
                                    text: 'Cuenta',
                                    style: 'tableHeader',
                                },
                                {
                                    text: 'SubCuenta',
                                    style: 'tableHeader',
                                },
                                {
                                    text: 'Análisis 1',
                                    style: 'tableHeader',
                                },
                                {
                                    text: 'Análisis 2',
                                    style: 'tableHeader',
                                },
                                {
                                    text: 'Análisis 3',
                                    style: 'tableHeader',
                                },
                                {
                                    text: 'Saldo Activos',
                                    style: 'tableHeader',
                                    alignment: 'right',
                                },
                                {
                                    text: 'Saldo Rodas',
                                    style: 'tableHeader',
                                    alignment: 'right',
                                },
                                {
                                    text: 'Diferencia',
                                    style: 'tableHeader',
                                    alignment: 'right',
                                },
                            ],
                            ...data.map((al: ConciliaUH) => {
                                return [
                                    {
                                        text: al.Cuenta,
                                        bold: al.Cuenta === 'TOTAL',
                                    },
                                    al.SubCuenta,
                                    al.Analisis1,
                                    al.Analisis2,
                                    al.Analisis3,
                                    {
                                        text: numberFormatter.format(
                                            al.SaldoUH
                                        ),
                                        bold: al.Cuenta === 'TOTAL',
                                        alignment: 'right',
                                    },
                                    {
                                        text: numberFormatter.format(
                                            al.SaldoRodas
                                        ),
                                        bold: al.Cuenta === 'TOTAL',
                                        alignment: 'right',
                                    },
                                    {
                                        text: numberFormatter.format(
                                            al.Diferencia
                                        ),
                                        bold: al.Cuenta === 'TOTAL',
                                        alignment: 'right',
                                    },
                                ];
                            }),
                        ],
                    },
                };
                break;
            case '1':
                returnValue = {
                    table: {
                        widths: [200, '*', '*', '*'],
                        body: [
                            [
                                {
                                    text: 'Unidad',
                                    style: 'tableHeader',
                                },
                                {
                                    text: 'Saldo Activos',
                                    style: 'tableHeader',
                                    alignment: 'right',
                                },
                                {
                                    text: 'Saldo Rodas',
                                    style: 'tableHeader',
                                    alignment: 'right',
                                },
                                {
                                    text: 'Diferencia',
                                    style: 'tableHeader',
                                    alignment: 'right',
                                },
                            ],
                            ...data.map((al: ConciliaUH) => {
                                return [
                                    al.Unidad,
                                    {
                                        text: numberFormatter.format(
                                            al.SaldoUH
                                        ),
                                        alignment: 'right',
                                    },
                                    {
                                        text: numberFormatter.format(
                                            al.SaldoRodas
                                        ),
                                        alignment: 'right',
                                    },
                                    {
                                        text: numberFormatter.format(
                                            al.Diferencia
                                        ),
                                        alignment: 'right',
                                    },
                                ];
                            }),
                        ],
                    },
                };
                break;
        }

        return returnValue;
    }

    public async getFormattedClasificador(data: any[]): Promise<any> {
        let _idUnidad = 0;

        const result: any[] = [];

        if (data && data.length) {
            data.forEach(element => {
                if (element.IdUnidad !== _idUnidad) {
                    result.push({
                        Field: 'Unidad',
                        Value: element.Unidad,
                        IdUnidad: element.IdUnidad,
                        IsGroupBy: true,
                    });

                    _idUnidad = element.IdUnidad;

                    result.push({
                        IdUnidad: element.IdUnidad,
                        CNMB: element.CNMB,
                        DCNMB: element.DCNMB,
                        TREPO: element.TREPO,
                        TREPO_UC: element.TREPO_UC,
                    });
                } else {
                    result.push({
                        IdUnidad: element.IdUnidad,
                        CNMB: element.CNMB,
                        DCNMB: element.DCNMB,
                        TREPO: element.TREPO,
                        TREPO_UC: element.TREPO_UC,
                    });
                }
            });
        }

        return result;
    }

    private _getClasificadorTable(clasif: any): object {
        let returnValue;

        returnValue = {
            table: {
                widths: [60, 250, 80, 80],
                body: [
                    [
                        {
                            text: 'CNMB',
                            style: 'tableHeader',
                        },
                        {
                            text: 'Descripción',
                            style: 'tableHeader',
                        },
                        {
                            text: 'TASA Clasificador',
                            style: 'tableHeader',
                        },
                        {
                            text: 'TASA Unidad',
                            style: 'tableHeader',
                        },
                    ],
                    ...clasif.map(
                        (clas: {
                            CNMB: any;
                            DCNMB: any;
                            TREPO: any;
                            TREPO_UC: any;
                        }) => {
                            return [
                                clas.CNMB,
                                clas.DCNMB,
                                clas.TREPO,
                                clas.TREPO_UC,
                            ];
                        }
                    ),
                ],
                margin: [0, 10, 0, 0],
            },
        };

        return returnValue;
    }

    dispose() {
        this.subscription.forEach(subs => subs.unsubscribe());
    }
}
