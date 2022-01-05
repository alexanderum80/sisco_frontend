import { numberFormatter } from './../../../shared/models/number';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class ConciliaGoldenDwhService {

  fg: FormGroup = new FormGroup({
    tipoCentro: new FormControl('0'),
    idDivision: new FormControl(null),
    idCentro: new FormControl(''),
    periodo: new FormControl(''),
    idEmpleado: new FormControl(''),
    idSupervisor: new FormControl(''),
    isComplejo: new FormControl(''),
    ventasAcumuladas: new FormControl(true),
    nota: new FormControl(''),
  });

  constructor() { }

  public async getConciliacionDefinition(conciliaData: any, tipoCentro: string, ventasAcumuladas: boolean): Promise<any> {
    const _conciliaData = await this.getFormattedConciliaDWH(conciliaData, tipoCentro);

    const definition: any[] = [];
    const tipos = ['Inventario', 'Ventas'];

    const groupData = _conciliaData.filter((d: { isGroupBy: any; }) => d.isGroupBy);

    groupData.forEach((element: any) => {
      if (element.field) {
        definition.push({
          text: element.field + ': ' + element.value,
          bold: true,
          margin: [0, 10, 0, 0]
        });
      }

      switch (tipoCentro) {
        case '0':
          tipos.forEach(tipo => {
            const data = _conciliaData.filter((f: any) => f.IdUnidad === element.IdUnidad && f.Tipo === tipo && !f.isGroupBy);

            if (data.length) {
              definition.push({
                text: tipo === 'Ventas' ? (ventasAcumuladas ? tipo + ' (Acumuladas)' : tipo + ' (Mes)') : tipo,
                alignment: 'center',
                bold: true,
                margin: [0, 10, 0, 0]
              });

              definition.push(this._getConciliacionTable(data, tipoCentro));
            }
          });
          break;
        case '1':
          tipos.forEach(tipo => {
            const data = _conciliaData.filter((f: any) => f.IdDivision === element.IdDivision && f.Tipo === tipo && !f.isGroupBy);

            if (data.length) {
              definition.push({
                text: tipo,
                alignment: 'center',
                bold: true,
                margin: [0, 10, 0, 0]
              });

              definition.push(this._getConciliacionTable(data, tipoCentro));
            }
          });
          break;
      }
    });

    return definition;
  }

  public async getAlmacenesDefinition(almacenesData: any): Promise<any> {
    const _almacenData = await this.getFormattedAlmacenesDWH(almacenesData);

    const definition: any[] = [];

    const groupData = _almacenData.filter((d: any) => d.isGroupBy);

    groupData.forEach((element: any) => {
      if (element.field) {
        definition.push({
          text: element.field + ': ' + element.value,
          bold: true,
          margin: [0, 10, 0, 0]
        });
      }

      const data = _almacenData.filter((f: any) => f.IdUnidad === element.IdUnidad && !f.isGroupBy);

      if (data.length) {
        definition.push(this._getAlmacenesTable(data));
      }
    });

    return definition;
  }

  public async getFormattedConciliaDWH(data: any[], tipoCentro: string): Promise<any> {
    let _idDivision = 0;
    let _idCentro = 0;
    let _tipo = '';
    let _totalUnidadGolden = 0;
    let _totalUnidadGoldenRest = 0;
    let _totalUnidadDifGoldenRest = 0;
    let _totalUnidadGoldenDist = 0;
    let _totalUnidadDifGoldenDist = 0;
    let _totalUnidadRodas = 0;
    let _totalUnidadDifGoldenRodas = 0;

    const result = [];

    if (data && data.length) {
      data.forEach(element => {
        if (element.IdDivision !== _idDivision) {
          result.push({
              Tipo: element.Tipo,
              field: 'División',
              value: element.Division,
              IdDivision: element.IdDivision,
              isGroupBy: true
          });
          _idDivision = element.IdDivision;
        }
        if (tipoCentro === '0' && (element.IdUnidad !== _idCentro || element.Tipo !== _tipo)) {
          if (_idCentro !== 0 || (element.Tipo !== _tipo && _tipo !== '')) {
            result.push({
              Tipo: _tipo,
              IdDivision: _idDivision,
              IdUnidad: _idCentro,
              Almacen: 'TOTAL',
              Cuenta: '',
              SaldoGolden: _totalUnidadGolden,
              SaldoRestaurador: _totalUnidadGoldenRest,
              DifGoldenRest: _totalUnidadDifGoldenRest,
              SaldoDistribuidor: _totalUnidadGoldenDist,
              DifGoldenDist: _totalUnidadDifGoldenDist,
              SaldoRodas: _totalUnidadRodas,
              DifGoldenRodas: _totalUnidadDifGoldenRodas
            });

            _totalUnidadGolden = 0;
            _totalUnidadGoldenRest = 0;
            _totalUnidadDifGoldenRest = 0;
            _totalUnidadGoldenDist = 0;
            _totalUnidadDifGoldenDist = 0;
            _totalUnidadRodas = 0;
            _totalUnidadDifGoldenRodas = 0;
          }

          if (element.IdUnidad !== _idCentro) {
            result.push({
                Tipo: element.Tipo,
                field: 'Unidad',
                value: element.Unidad,
                IdUnidad: element.IdUnidad,
                isGroupBy: true
            });

            _idCentro = element.IdUnidad;
          }

          result.push({
            Tipo: element.Tipo,
            IdDivision: element.IdDivision,
            IdUnidad: element.IdUnidad,
            Unidad: element.Unidad,
            Almacen: element.Almacen,
            Cuenta: element.Cuenta,
            SaldoGolden: element.SaldoGolden,
            SaldoRestaurador: element.SaldoRestaurador,
            DifGoldenRest: element.DifGoldenRest,
            SaldoDistribuidor: element.SaldoDistribuidor,
            DifGoldenDist: element.DifGoldenDist,
            SaldoRodas: element.SaldoRodas,
            DifGoldenRodas: element.DifGoldenRodas
          });

          _totalUnidadGolden += element.SaldoGolden;
          _totalUnidadGoldenRest += element.SaldoRestaurador;
          _totalUnidadDifGoldenRest += element.DifGoldenRest;
          _totalUnidadGoldenDist += element.SaldoDistribuidor;
          _totalUnidadDifGoldenDist += element.DifGoldenDist;
          _totalUnidadRodas += element.SaldoRodas;
          _totalUnidadDifGoldenRodas += element.DifGoldenRodas;

          _tipo = element.Tipo;
        } else if (tipoCentro === '1' && (element.IdDivision !== _idDivision || element.Tipo !== _tipo)) {
          if (_idCentro !== 0 || (element.Tipo !== _tipo && _tipo !== '')) {
            result.push({
              Tipo: _tipo,
              IdDivision: _idDivision,
              IdUnidad: _idCentro,
              Unidad: 'TOTAL',
              Almacen: '',
              Cuenta: '',
              SaldoGolden: _totalUnidadGolden,
              SaldoRestaurador: _totalUnidadGoldenRest,
              DifGoldenRest: _totalUnidadDifGoldenRest,
              SaldoDistribuidor: _totalUnidadGoldenDist,
              DifGoldenDist: _totalUnidadDifGoldenDist,
              SaldoRodas: _totalUnidadRodas,
              DifGoldenRodas: _totalUnidadDifGoldenRodas
            });

            _totalUnidadGolden = 0;
            _totalUnidadGoldenRest = 0;
            _totalUnidadDifGoldenRest = 0;
            _totalUnidadGoldenDist = 0;
            _totalUnidadDifGoldenDist = 0;
            _totalUnidadRodas = 0;
            _totalUnidadDifGoldenRodas = 0;
          }

          result.push({
            Tipo: element.Tipo,
            IdDivision: element.IdDivision,
            IdUnidad: element.IdUnidad,
            Unidad: element.Unidad,
            Almacen: element.Almacen,
            Cuenta: element.Cuenta,
            SaldoGolden: element.SaldoGolden,
            SaldoRestaurador: element.SaldoRestaurador,
            DifGoldenRest: element.DifGoldenRest,
            SaldoDistribuidor: element.SaldoDistribuidor,
            DifGoldenDist: element.DifGoldenDist,
            SaldoRodas: element.SaldoRodas,
            DifGoldenRodas: element.DifGoldenRodas
          });

          _totalUnidadGolden += element.SaldoGolden;
          _totalUnidadGoldenRest += element.SaldoRestaurador;
          _totalUnidadDifGoldenRest += element.DifGoldenRest;
          _totalUnidadGoldenDist += element.SaldoDistribuidor;
          _totalUnidadDifGoldenDist += element.DifGoldenDist;
          _totalUnidadRodas += element.SaldoRodas;
          _totalUnidadDifGoldenRodas += element.DifGoldenRodas;

          _tipo = element.Tipo;

          if (element.IdDivision !== _idDivision) {
            result.push({
                Tipo: element.Tipo,
                field: 'División',
                value: element.Division,
                IdDivision: element.IdDivision,
                isGroupBy: true
            });

            _idDivision = element.IdDivision;
          }
        } else {
          result.push({
            Tipo: element.Tipo,
            IdDivision: element.IdDivision,
            IdUnidad: element.IdUnidad,
            Unidad: element.Unidad,
            Almacen: element.Almacen,
            Cuenta: element.Cuenta,
            SaldoGolden: element.SaldoGolden,
            SaldoRestaurador: element.SaldoRestaurador,
            DifGoldenRest: element.DifGoldenRest,
            SaldoDistribuidor: element.SaldoDistribuidor,
            DifGoldenDist: element.DifGoldenDist,
            SaldoRodas: element.SaldoRodas,
            DifGoldenRodas: element.DifGoldenRodas
          });

          _totalUnidadGolden += element.SaldoGolden;
          _totalUnidadGoldenRest += element.SaldoRestaurador;
          _totalUnidadDifGoldenRest += element.DifGoldenRest;
          _totalUnidadGoldenDist += element.SaldoDistribuidor;
          _totalUnidadDifGoldenDist += element.DifGoldenDist;
          _totalUnidadRodas += element.SaldoRodas;
          _totalUnidadDifGoldenRodas += element.DifGoldenRodas;
        }
      });

      result.push({
        Tipo: _tipo,
        IdDivision: _idDivision,
        IdUnidad: _idCentro,
        Unidad: 'TOTAL',
        Almacen: 'TOTAL',
        Cuenta: '',
        SaldoGolden: _totalUnidadGolden,
        SaldoRestaurador: _totalUnidadGoldenRest,
        DifGoldenRest: _totalUnidadDifGoldenRest,
        SaldoDistribuidor: _totalUnidadGoldenDist,
        DifGoldenDist: _totalUnidadDifGoldenDist,
        SaldoRodas: _totalUnidadRodas,
        DifGoldenRodas: _totalUnidadDifGoldenRodas
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
            widths: [100, 92, '*', '*', '*', '*', '*', '*', '*'],
            body: [
              [{
                text: 'Almacén',
                style: 'tableHeader'
              },
              {
                text: 'Cuenta',
                style: 'tableHeader'
              },
              {
                text: 'Saldo Golden',
                style: 'tableHeader',
                alignment : 'right'
              },
              {
                text: 'Saldo Restaurador',
                style: 'tableHeader',
                alignment : 'right'
              },
              {
                text: 'Dif. Golden Rest.',
                style: 'tableHeader',
                alignment : 'right'
              },
              {
                text: 'Saldo Distribuidor',
                style: 'tableHeader',
                alignment : 'right'
              },
              {
                text: 'Dif. Golden Dist.',
                style: 'tableHeader',
                alignment : 'right'
              },
              {
                text: 'Saldo Rodas',
                style: 'tableHeader',
                alignment : 'right'
              },
              {
                text: 'Dif. Golden Rodas',
                style: 'tableHeader',
                alignment : 'right'
              },
              ],
              ...data.map((al: any) => {
                return [al.Almacen, al.Cuenta,
                  { text: numberFormatter.format(al.SaldoGolden), alignment: 'right'},
                  { text: numberFormatter.format(al.SaldoRestaurador), alignment: 'right'},
                  { text: numberFormatter.format(al.DifGoldenRest), alignment: 'right'},
                  { text: numberFormatter.format(al.SaldoDistribuidor), alignment: 'right'},
                  { text: numberFormatter.format(al.DifGoldenDist), alignment: 'right'},
                  { text: numberFormatter.format(al.SaldoRodas), alignment: 'right'},
                  { text: numberFormatter.format(al.DifGoldenRodas), alignment: 'right'}
                ];
              })
            ]
          }
        };
        break;
      case '1':
        returnValue = {
          table: {
            widths: [150, '*', '*', '*', '*', '*', '*', '*'],
            body: [
              [{
                text: 'Unidad',
                style: 'tableHeader'
              },
              {
                text: 'Saldo Golden',
                style: 'tableHeader',
                alignment : 'right'
              },
              {
                text: 'Saldo Restaurador',
                style: 'tableHeader',
                alignment : 'right'
              },
              {
                text: 'Dif. Golden Rest.',
                style: 'tableHeader',
                alignment : 'right'
              },
              {
                text: 'Saldo Distribuidor',
                style: 'tableHeader',
                alignment : 'right'
              },
              {
                text: 'Dif. Golden Dist.',
                style: 'tableHeader',
                alignment : 'right'
              },
              {
                text: 'Saldo Rodas',
                style: 'tableHeader',
                alignment : 'right'
              },
              {
                text: 'Dif. Golden Rodas',
                style: 'tableHeader',
                alignment : 'right'
              },
              ],
              ...data.map((al: { Unidad: any; SaldoGolden: number | bigint; SaldoRestaurador: number | bigint; DifGoldenRest: number | bigint; SaldoDistribuidor: number | bigint; DifGoldenDist: number | bigint; SaldoRodas: number | bigint; DifGoldenRodas: number | bigint; }) => {
                return [al.Unidad,
                  { text: numberFormatter.format(al.SaldoGolden), alignment: 'right'},
                  { text: numberFormatter.format(al.SaldoRestaurador), alignment: 'right'},
                  { text: numberFormatter.format(al.DifGoldenRest), alignment: 'right'},
                  { text: numberFormatter.format(al.SaldoDistribuidor), alignment: 'right'},
                  { text: numberFormatter.format(al.DifGoldenDist), alignment: 'right'},
                  { text: numberFormatter.format(al.SaldoRodas), alignment: 'right'},
                  { text: numberFormatter.format(al.DifGoldenRodas), alignment: 'right'}
                ];
              })
            ]
          }
        };
        break;
    }

    return returnValue;
  }

  public async getFormattedAlmacenesDWH(data: any[]): Promise<any> {
    let _idCentro = 0;
    let _idUnidad = 0;

    const result: any[] = [];

    if (data && data.length) {
      data.forEach(element => {
        if (element.IdCentro !== _idCentro) {
          result.push({
              field: 'Centro',
              value: element.Centro,
              IdCentro: element.IdCentro,
              isGroupBy: true
          });
          _idCentro = element.IdCentro;
        }
        if (element.IdUnidad !== _idUnidad) {
          result.push({
              field: 'Unidad',
              value: element.Unidad,
              IdUnidad: element.IdUnidad,
              isGroupBy: true
          });

          _idUnidad = element.IdUnidad;

          result.push({
            IdCentro: element.IdCentro,
            IdUnidad: element.IdUnidad,
            Almacen: element.Almacen,
            CuentaG: element.CuentaG,
            CuentaR: element.CuentaR,
          });
        } else {
          result.push({
            IdCentro: element.IdCentro,
            IdUnidad: element.IdUnidad,
            Almacen: element.Almacen,
            CuentaG: element.CuentaG,
            CuentaR: element.CuentaR,
          });
        }
      });
    }

    return result;
  }

  private _getAlmacenesTable(almacenes: any): object {
    let returnValue;

    returnValue = {
      table: {
        widths: [250, 120, 120],
        body: [
          [{
            text: 'Almacén',
            style: 'tableHeader'
          },
          {
            text: 'Cuenta Golden',
            style: 'tableHeader'
          },
          {
            text: 'Cuenta Rodas',
            style: 'tableHeader'
          }],
          ...almacenes.map((al: { Almacen: any; CuentaG: any; CuentaR: any; }) => {
            return [al.Almacen, al.CuentaG, al.CuentaR];
          })
        ],
        margin: [0, 10, 0, 0]
      }
    };

    return returnValue;
  }


}
