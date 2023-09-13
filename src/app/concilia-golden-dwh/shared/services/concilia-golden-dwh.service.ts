import { IConciliaDWH } from './../models/concilia-dwh.model';
import { Apollo } from 'apollo-angular';
import { Observable, Subscription } from 'rxjs';
import { numberFormatter } from './../../../shared/models/number';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { ConciliaDWHQueryResponse } from '../models/concilia-dwh.model';
import { orderBy, toNumber, uniq } from 'lodash';
import * as moment from 'moment';
import { getConciliacionMonth } from '../../../shared/models';

const conciliaDWHQuery = require('graphql-tag/loader!../graphql/concilia-dwh.query.gql');

@Injectable()
export class ConciliaGoldenDwhService {
  fg: FormGroup = new FormGroup({
    tipoCentro: new FormControl('0', { initialValueIsDefault: true }),
    idDivision: new FormControl(null, { initialValueIsDefault: true }),
    idCentro: new FormControl(null, { initialValueIsDefault: true }),
    periodo: new FormControl(getConciliacionMonth(new Date()), {
      initialValueIsDefault: true,
    }),
    idEmpleado: new FormControl(null, { initialValueIsDefault: true }),
    idSupervisor: new FormControl(null, { initialValueIsDefault: true }),
    ventasAcumuladas: new FormControl(true, { initialValueIsDefault: true }),
    nota: new FormControl('', { initialValueIsDefault: true }),
  });

  subscription: Subscription[] = [];

  constructor(private _apollo: Apollo) {}

  conciliar(): Observable<ConciliaDWHQueryResponse> {
    const conciliaDWHInput = {
      idDivision: toNumber(this.fg.controls['idDivision'].value),
      idCentro: toNumber(this.fg.controls['idCentro'].value),
      periodo: toNumber(moment(this.fg.controls['periodo'].value).format('MM')),
      annio: toNumber(moment(this.fg.controls['periodo'].value).format('YYYY')),
      tipoCentro: toNumber(this.fg.controls['tipoCentro'].value),
      ventasAcumuladas: this.fg.controls['ventasAcumuladas'].value,
    };

    return new Observable<ConciliaDWHQueryResponse>(subscriber => {
      this._apollo
        .query<ConciliaDWHQueryResponse>({
          query: conciliaDWHQuery,
          variables: { conciliaDWHInput },
          fetchPolicy: 'network-only',
        })
        .subscribe({
          next: res => {
            subscriber.next(res.data);
          },
          error: err => {
            subscriber.error(err.message || err);
          },
        });
    });
  }

  public async getConciliacionDefinition(
    conciliaData: IConciliaDWH[],
    tipoCentro: string,
    ventasAcumuladas: boolean
  ): Promise<any> {
    // const _conciliaData = await this.getFormattedConciliaDWH(
    //   conciliaData,
    //   tipoCentro
    // );

    const definition: any[] = [];

    const _orderArray =
      tipoCentro === '0'
        ? ['IdDivision', 'IdUnidad', 'Tipo']
        : ['IdDivision', 'Tipo', 'IdUnidad'];

    const _tipos = ['Inventario', 'Ventas'];

    conciliaData = orderBy(conciliaData, _orderArray);

    const _divisiones = uniq(conciliaData.map(d => d.Division));

    _divisiones.forEach(division => {
      definition.push({
        text: 'División: ' + division,
        bold: true,
        margin: [0, 10, 0, 0],
      });

      switch (tipoCentro) {
        case '0': // centro
          const _centros = uniq(
            conciliaData.filter(f => f.Division === division).map(d => d.Centro)
          );
          _centros.forEach(centro => {
            definition.push({
              text: 'Centro: ' + centro,
              bold: true,
              margin: [0, 10, 0, 0],
            });

            const _unidades = uniq(
              conciliaData
                .filter(f => f.Division === division)
                .map(d => d.Unidad)
            );
            _unidades.forEach(unidad => {
              definition.push({
                text: 'Unidad asociada: ' + unidad,
                bold: true,
                margin: [0, 10, 0, 0],
              });

              _tipos.forEach(tipo => {
                definition.push({
                  text:
                    tipo === 'Ventas'
                      ? ventasAcumuladas
                        ? tipo + ' (Acumuladas)'
                        : tipo + ' (Mes)'
                      : tipo,
                  alignment: 'center',
                  bold: true,
                  margin: [0, 5, 0, 0],
                });

                const _filteredData = conciliaData.filter(
                  f =>
                    f.Division === division &&
                    f.Unidad === unidad &&
                    f.Tipo === tipo
                );

                definition.push(
                  this._getConciliacionTable(_filteredData, tipoCentro)
                );
              });
            });
          });
          break;
        case '1': // consolidado
          _tipos.forEach(tipo => {
            definition.push({
              text:
                tipo === 'Ventas'
                  ? ventasAcumuladas
                    ? tipo + ' (Acumuladas)'
                    : tipo + ' (Mes)'
                  : tipo,
              alignment: 'center',
              bold: true,
              margin: [0, 5, 0, 0],
            });

            const _filteredData = conciliaData.filter(
              f => f.Division === division && f.Tipo === tipo
            );

            definition.push(
              this._getConciliacionTable(_filteredData, tipoCentro)
            );
          });
          break;
      }
    });

    return definition;
  }

  public async getAlmacenesDefinition(
    almacenesData: IConciliaDWH[]
  ): Promise<any> {
    // const _almacenData = await this.getFormattedAlmacenesDWH(almacenesData);

    const definition: any[] = [];

    const _unidades = uniq(almacenesData.map(d => d.Unidad));

    _unidades.forEach(unidad => {
      definition.push({
        text: 'Unidad: ' + unidad,
        bold: true,
        margin: [0, 5, 0, 0],
      });

      const data = almacenesData.filter((f: any) => f.Unidad === unidad);

      if (data.length) {
        definition.push(this._getAlmacenesTable(data));
      }
    });

    return definition;
  }

  private _getConciliacionTable(data: any, tipoCentro: string): object {
    let returnValue = {};

    let _totalGolden = 0;
    let _totalGoldenRest = 0;
    let _totalDifGoldenRest = 0;
    let _totalGoldenDist = 0;
    let _totalDifGoldenDist = 0;
    let _totalRodas = 0;
    let _totalDifGoldenRodas = 0;

    switch (tipoCentro) {
      case '0':
        returnValue = {
          table: {
            widths: [100, 92, '*', '*', '*', '*', '*', '*', '*'],
            body: [
              [
                {
                  text: 'Almacén',
                  style: 'tableHeader',
                },
                {
                  text: 'Cuenta',
                  style: 'tableHeader',
                },
                {
                  text: 'Saldo Golden',
                  style: 'tableHeader',
                  alignment: 'right',
                },
                {
                  text: 'Saldo Restaurador',
                  style: 'tableHeader',
                  alignment: 'right',
                },
                {
                  text: 'Dif. Golden Rest.',
                  style: 'tableHeader',
                  alignment: 'right',
                },
                {
                  text: 'Saldo Distribuidor',
                  style: 'tableHeader',
                  alignment: 'right',
                },
                {
                  text: 'Dif. Golden Dist.',
                  style: 'tableHeader',
                  alignment: 'right',
                },
                {
                  text: 'Saldo Rodas',
                  style: 'tableHeader',
                  alignment: 'right',
                },
                {
                  text: 'Dif. Golden Rodas',
                  style: 'tableHeader',
                  alignment: 'right',
                },
              ],
              ...data.map((c: IConciliaDWH) => {
                _totalGolden += c.SaldoGolden;
                _totalGoldenRest += c.SaldoRestaurador;
                _totalDifGoldenRest += c.DifGoldenRest;
                _totalGoldenDist += c.SaldoDistribuidor;
                _totalDifGoldenDist += c.DifGoldenDist;
                _totalRodas += c.SaldoRodas;
                _totalDifGoldenRodas += c.DifGoldenRodas;

                return [
                  {
                    text: c.Almacen,
                  },
                  c.Cuenta,
                  {
                    text: numberFormatter.format(c.SaldoGolden),
                    alignment: 'right',
                  },
                  {
                    text: numberFormatter.format(c.SaldoRestaurador),
                    alignment: 'right',
                  },
                  {
                    text: numberFormatter.format(c.DifGoldenRest),
                    alignment: 'right',
                  },
                  {
                    text: numberFormatter.format(c.SaldoDistribuidor),
                    alignment: 'right',
                  },
                  {
                    text: numberFormatter.format(c.DifGoldenDist),
                    alignment: 'right',
                  },
                  {
                    text: numberFormatter.format(c.SaldoRodas),
                    alignment: 'right',
                  },
                  {
                    text: numberFormatter.format(c.DifGoldenRodas),
                    alignment: 'right',
                  },
                ];
              }),
              [
                {
                  text: 'TOTAL',
                  bold: true,
                },
                {},
                {
                  text: numberFormatter.format(_totalGolden),
                  alignment: 'right',
                  bold: true,
                },
                {
                  text: numberFormatter.format(_totalGoldenRest),
                  alignment: 'right',
                  bold: true,
                },
                {
                  text: numberFormatter.format(_totalDifGoldenRest),
                  alignment: 'right',
                  bold: true,
                },
                {
                  text: numberFormatter.format(_totalGoldenDist),
                  alignment: 'right',
                  bold: true,
                },
                {
                  text: numberFormatter.format(_totalDifGoldenDist),
                  alignment: 'right',
                  bold: true,
                },
                {
                  text: numberFormatter.format(_totalRodas),
                  alignment: 'right',
                  bold: true,
                },
                {
                  text: numberFormatter.format(_totalDifGoldenRodas),
                  alignment: 'right',
                  bold: true,
                },
              ],
            ],
          },
        };
        break;
      case '1':
        returnValue = {
          table: {
            widths: [150, '*', '*', '*', '*', '*', '*', '*'],
            body: [
              [
                {
                  text: 'Unidad',
                  style: 'tableHeader',
                },
                {
                  text: 'Saldo Golden',
                  style: 'tableHeader',
                  alignment: 'right',
                },
                {
                  text: 'Saldo Restaurador',
                  style: 'tableHeader',
                  alignment: 'right',
                },
                {
                  text: 'Dif. Golden Rest.',
                  style: 'tableHeader',
                  alignment: 'right',
                },
                {
                  text: 'Saldo Distribuidor',
                  style: 'tableHeader',
                  alignment: 'right',
                },
                {
                  text: 'Dif. Golden Dist.',
                  style: 'tableHeader',
                  alignment: 'right',
                },
                {
                  text: 'Saldo Rodas',
                  style: 'tableHeader',
                  alignment: 'right',
                },
                {
                  text: 'Dif. Golden Rodas',
                  style: 'tableHeader',
                  alignment: 'right',
                },
              ],
              ...data.map((c: IConciliaDWH) => {
                _totalGolden += c.SaldoGolden;
                _totalGoldenRest += c.SaldoRestaurador;
                _totalDifGoldenRest += c.DifGoldenRest;
                _totalGoldenDist += c.SaldoDistribuidor;
                _totalDifGoldenDist += c.DifGoldenDist;
                _totalRodas += c.SaldoRodas;
                _totalDifGoldenRodas += c.DifGoldenRodas;
                return [
                  {
                    text: c.Unidad,
                  },
                  {
                    text: numberFormatter.format(c.SaldoGolden),
                    alignment: 'right',
                  },
                  {
                    text: numberFormatter.format(c.SaldoRestaurador),
                    alignment: 'right',
                  },
                  {
                    text: numberFormatter.format(c.DifGoldenRest),
                    alignment: 'right',
                  },
                  {
                    text: numberFormatter.format(c.SaldoDistribuidor),
                    alignment: 'right',
                  },
                  {
                    text: numberFormatter.format(c.DifGoldenDist),
                    alignment: 'right',
                  },
                  {
                    text: numberFormatter.format(c.SaldoRodas),
                    alignment: 'right',
                  },
                  {
                    text: numberFormatter.format(c.DifGoldenRodas),
                    alignment: 'right',
                  },
                ];
              }),
              [
                {
                  text: 'TOTAL',
                  bold: true,
                },
                {
                  text: numberFormatter.format(_totalGolden),
                  alignment: 'right',
                  bold: true,
                },
                {
                  text: numberFormatter.format(_totalGoldenRest),
                  alignment: 'right',
                  bold: true,
                },
                {
                  text: numberFormatter.format(_totalDifGoldenRest),
                  alignment: 'right',
                  bold: true,
                },
                {
                  text: numberFormatter.format(_totalGoldenDist),
                  alignment: 'right',
                  bold: true,
                },
                {
                  text: numberFormatter.format(_totalDifGoldenDist),
                  alignment: 'right',
                  bold: true,
                },
                {
                  text: numberFormatter.format(_totalRodas),
                  alignment: 'right',
                  bold: true,
                },
                {
                  text: numberFormatter.format(_totalDifGoldenRodas),
                  alignment: 'right',
                  bold: true,
                },
              ],
            ],
          },
        };
        break;
    }

    return returnValue;
  }

  private _getAlmacenesTable(almacenes: any): object {
    let returnValue;

    returnValue = {
      table: {
        widths: [250, 120, 120],
        body: [
          [
            {
              text: 'Almacén',
              style: 'tableHeader',
            },
            {
              text: 'Cuenta Golden',
              style: 'tableHeader',
            },
            {
              text: 'Cuenta Rodas',
              style: 'tableHeader',
            },
          ],
          ...almacenes.map(
            (al: { Almacen: any; Cuenta: any; CuentaR: any }) => {
              return [al.Almacen, al.Cuenta, al.CuentaR];
            }
          ),
        ],
        margin: [0, 10, 0, 0],
      },
    };

    return returnValue;
  }

  dispose(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}
