import { ApolloService } from '../../../shared/helpers/apollo.service';
import { conciliaAftApi } from './../graphql/concilia-aft.actions';
import {
  ConciliaAFTQueryResponse,
  IDiferenciaClasificadorCNMB,
} from './../models/concilia-aft.model';
import { SelectItem } from 'primeng/api';
import { numberFormatter } from './../../../shared/models/number';
import { toNumber, uniq } from 'lodash';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { getConciliacionMonth } from '../../../shared/models';

@Injectable()
export class ConciliaAftService {
  fg: FormGroup = new FormGroup({
    tipoCentro: new FormControl('0', { initialValueIsDefault: true }),
    idCentro: new FormControl(null, { initialValueIsDefault: true }),
    tipoEntidad: new FormControl(null, { initialValueIsDefault: true }),
    periodo: new FormControl(getConciliacionMonth(new Date()), {
      initialValueIsDefault: true,
    }),
    nota: new FormControl('', { initialValueIsDefault: true }),
  });

  subscription: Subscription[] = [];

  constructor(private _apolloSvc: ApolloService) {}

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

  public conciliar(): Observable<ConciliaAFTQueryResponse> {
    const conciliaAftInput = {
      idCentro: toNumber(this.fg.controls['idCentro'].value),
      periodo: toNumber(moment(this.fg.controls['periodo'].value).format('MM')),
      annio: toNumber(moment(this.fg.controls['periodo'].value).format('YYYY')),
    };

    return new Observable<ConciliaAFTQueryResponse>(subscriber => {
      this._apolloSvc
        .query<ConciliaAFTQueryResponse>(conciliaAftApi.concilia, {
          conciliaAftInput,
        })
        .subscribe({
          next: res => {
            subscriber.next(res);
          },
          error: err => {
            subscriber.error(err.message || err);
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
    const tipos = ['Inventario', 'Depreciación'];

    const groupData = _conciliaData.filter(
      (d: { isGroupBy: any }) => d.isGroupBy
    );

    groupData.forEach((element: any) => {
      if (element.field) {
        definition.push({
          text: element.field + ': ' + element.value,
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
                !f.isGroupBy
            );

            if (data.length) {
              definition.push({
                text: tipo,
                alignment: 'center',
                bold: true,
                margin: [0, 5, 0, 0],
              });

              definition.push(this._getConciliacionTable(data, tipoCentro));
            }
          });
          break;
        case '1':
          tipos.forEach(tipo => {
            const data = _conciliaData.filter(
              (f: any) =>
                f.IdDivision === element.IdDivision &&
                f.Tipo === tipo &&
                !f.isGroupBy
            );

            if (data.length) {
              definition.push({
                text: tipo,
                alignment: 'center',
                bold: true,
                margin: [0, 5, 0, 0],
              });

              definition.push(this._getConciliacionTable(data, tipoCentro));
            }
          });
          break;
      }
    });

    return definition;
  }

  public async getClasificadorDefinition(
    clasifData: IDiferenciaClasificadorCNMB[]
  ): Promise<any> {
    const definition: any[] = [];

    const _unidades = uniq(clasifData.map(d => d.Unidad));

    _unidades.forEach(_unidad => {
      definition.push({
        text: 'Unidad: ' + _unidad,
        bold: true,
        margin: [0, 5, 0, 0],
      });

      const data = clasifData.filter(f => f.Unidad === _unidad);

      if (data.length) {
        definition.push(this._getClasificadorTable(data));
      }
    });

    return definition;
  }

  public async getFormattedConcilia(
    data: any[],
    tipoCentro: string
  ): Promise<any> {
    let _idDivision = 0;
    let _idCentro = 0;
    let _tipo = '';
    let _totalAFT = 0;
    let _totalRodas = 0;
    let _totalDif = 0;

    const result = [];

    if (data && data.length) {
      data.forEach(element => {
        // if (element.IdDivision !== _idDivision) {
        //     result.push({
        //         Tipo: element.Tipo,
        //         field: 'División',
        //         value: element.Division,
        //         IdDivision: element.IdDivision,
        //         isGroupBy: true,
        //     });
        //     _idDivision = element.IdDivision;
        // }
        if (
          tipoCentro === '0' &&
          (element.IdUnidad !== _idCentro || element.Tipo !== _tipo)
        ) {
          if (_idCentro !== 0 || (element.Tipo !== _tipo && _tipo !== '')) {
            result.push({
              Tipo: _tipo,
              IdDivision: _idDivision,
              IdUnidad: _idCentro,
              Cta: 'TOTAL',
              Scta: '',
              An1: '',
              An2: '',
              An3: '',
              Saldo_AF: _totalAFT,
              Saldo_Rodas: _totalRodas,
              Diferencia: _totalDif,
            });

            _totalAFT = 0;
            _totalRodas = 0;
            _totalDif = 0;
          }

          if (element.IdUnidad !== _idCentro) {
            result.push({
              Tipo: element.Tipo,
              field: 'Unidad',
              value: element.Unidad,
              IdUnidad: element.IdUnidad,
              isGroupBy: true,
            });

            _idCentro = element.IdUnidad;
          }

          result.push({
            Tipo: element.Tipo,
            IdDivision: element.IdDivision,
            IdUnidad: element.IdUnidad,
            Unidad: element.Unidad,
            Cta: element.Cta,
            Scta: element.Scta,
            An1: element.An1,
            An2: element.An2,
            An3: element.An3,
            Saldo_AF: element.Saldo_AF,
            Saldo_Rodas: element.Saldo_Rodas,
            Diferencia: element.Diferencia,
          });

          _totalAFT += element.Saldo_AF;
          _totalRodas += element.Saldo_Rodas;
          _totalDif += element.Diferencia;

          _tipo = element.Tipo;
        } else if (
          tipoCentro === '1' &&
          (element.IdDivision !== _idDivision || element.Tipo !== _tipo)
        ) {
          if (_idCentro !== 0 || (element.Tipo !== _tipo && _tipo !== '')) {
            result.push({
              Tipo: _tipo,
              IdDivision: _idDivision,
              IdUnidad: _idCentro,
              Cta: 'TOTAL',
              Scta: '',
              An1: '',
              An2: '',
              An3: '',
              Saldo_AF: _totalAFT,
              Saldo_Rodas: _totalRodas,
              Diferencia: _totalDif,
            });

            _totalAFT = 0;
            _totalRodas = 0;
            _totalDif = 0;
          }

          result.push({
            Tipo: element.Tipo,
            IdDivision: element.IdDivision,
            IdUnidad: element.IdUnidad,
            Unidad: element.Unidad,
            Cta: element.Cta,
            Scta: element.Scta,
            An1: element.An1,
            An2: element.An2,
            An3: element.An3,
            Saldo_AF: element.Saldo_AF,
            Saldo_Rodas: element.Saldo_Rodas,
            Diferencia: element.Diferencia,
          });

          _totalAFT += element.Saldo_AF;
          _totalRodas += element.Saldo_Rodas;
          _totalDif += element.Diferencia;

          _tipo = element.Tipo;

          if (element.IdDivision !== _idDivision) {
            result.push({
              Tipo: element.Tipo,
              field: 'División',
              value: element.Division,
              IdDivision: element.IdDivision,
              isGroupBy: true,
            });

            _idDivision = element.IdDivision;
          }
        } else {
          result.push({
            Tipo: element.Tipo,
            IdDivision: element.IdDivision,
            IdUnidad: element.IdUnidad,
            Unidad: element.Unidad,
            Cta: element.Cta,
            Scta: element.Scta,
            An1: element.An1,
            An2: element.An2,
            An3: element.An3,
            Saldo_AF: element.Saldo_AF,
            Saldo_Rodas: element.Saldo_Rodas,
            Diferencia: element.Diferencia,
          });

          _totalAFT += element.Saldo_AF;
          _totalRodas += element.Saldo_Rodas;
          _totalDif += element.Diferencia;
        }
      });

      result.push({
        Tipo: _tipo,
        IdDivision: _idDivision,
        IdUnidad: _idCentro,
        Cta: 'TOTAL',
        Scta: '',
        An1: '',
        An2: '',
        An3: '',
        Saldo_AF: _totalAFT,
        Saldo_Rodas: _totalRodas,
        Diferencia: _totalDif,
      });
    }

    return result;
  }

  private _getConciliacionTable(data: any, tipoCentro: string): object {
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
              ...data.map((al: any) => {
                return [
                  {
                    text: al.Cta,
                    bold: al.Cta === 'TOTAL',
                  },
                  al.Scta,
                  al.An1,
                  al.An2,
                  al.An3,
                  {
                    text: numberFormatter.format(al.Saldo_AF),
                    bold: al.Cta === 'TOTAL',
                    alignment: 'right',
                  },
                  {
                    text: numberFormatter.format(al.Saldo_Rodas),
                    bold: al.Cta === 'TOTAL',
                    alignment: 'right',
                  },
                  {
                    text: numberFormatter.format(al.Diferencia),
                    bold: al.Cta === 'TOTAL',
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
              ...data.map(
                (al: {
                  Unidad: string;
                  Saldo_AF: number | bigint;
                  Saldo_Rodas: number | bigint;
                  Diferencia: number | bigint;
                }) => {
                  return [
                    al.Unidad,
                    {
                      text: numberFormatter.format(al.Saldo_AF),
                      alignment: 'right',
                    },
                    {
                      text: numberFormatter.format(al.Saldo_Rodas),
                      alignment: 'right',
                    },
                    {
                      text: numberFormatter.format(al.Diferencia),
                      alignment: 'right',
                    },
                  ];
                }
              ),
            ],
          },
        };
        break;
    }

    return returnValue;
  }

  private _getClasificadorTable(clasif: IDiferenciaClasificadorCNMB[]): object {
    let returnValue;

    returnValue = {
      table: {
        widths: [30, 40, 200, 40, 80, 80],
        body: [
          [
            {
              text: 'Grupo',
              style: 'tableHeader',
            },
            {
              text: 'Código',
              style: 'tableHeader',
            },
            {
              text: 'Descripción',
              style: 'tableHeader',
            },
            {
              text: 'Deprecia',
              style: 'tableHeader',
              alignment: 'center',
            },
            {
              text: 'TASA Clasificador',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'TASA Unidad',
              style: 'tableHeader',
              alignment: 'right',
            },
          ],
          ...clasif.map((clas: IDiferenciaClasificadorCNMB) => {
            return [
              clas.Grupo,
              clas.Codigo,
              clas.Descripcion,
              {
                text: clas.Deprecia ? 'X' : '',
                alignment: 'center',
              },
              {
                text: clas.Tasa,
                alignment: 'right',
              },
              {
                text: clas.TasaUC,
                alignment: 'right',
              },
            ];
          }),
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
