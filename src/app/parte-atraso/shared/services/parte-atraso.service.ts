import { DateFormatEnum, LocaleFormatEnum } from './../../../shared/models/date-range';
import { formatDate } from '@angular/common';
import { sortBy } from 'lodash';
import { Injectable } from '@angular/core';

@Injectable()
export class ParteAtrasoService {

  constructor() { }

  public async getParteAtrasosDefinition(parteAtrasosData: any): Promise<any> {
    const returnValue = [];

    returnValue.push({
      table: {
        widths: [200, 149, 149],
        body: [[
          {},
          {
            text: 'División',
            style: 'tableHeader',
            alignment: 'center'
          },
          {
            text: 'Empresa',
            style: 'tableHeader',
            alignment: 'center'
          },
        ]]
      }
    });

    returnValue.push({
      table: {
        widths: [200, 70, 70, 70, 70],
        body: [
          [{
            text: 'Unidad',
            style: 'tableHeader'
          },
          {
            text: 'Atraso Restaurador',
            style: 'tableHeader'
          },
          {
            text: 'Atraso DWH',
            style: 'tableHeader'
          },
          {
            text: 'Atraso Distribuidor',
            style: 'tableHeader'
          },
          {
            text: 'Atraso DWH',
            style: 'tableHeader'
          }],
          ...parteAtrasosData.map((p: { Unidad: any; AtrasoRest: any; AtrasoDWH: any; AtrasoDist: any; AtrasoEmp: any; }) => {
            return [p.Unidad, p.AtrasoRest, p.AtrasoDWH, p.AtrasoDist, p.AtrasoEmp];
          })
        ],
        margin: [0, 10, 0, 0]
      }
    });

    return returnValue;
  }

  public async getFormattedDetalleParteAtraso(data: any[]): Promise<any> {
    let _idCentro = 0;

    const result: any[] = [];

    if (data && data.length) {
      data = sortBy(data, ['IdUnidad', 'Ano', 'Mes']);
      data.forEach(element => {
        if (element.IdUnidad !== _idCentro) {
          result.push({
              field: 'Unidad',
              value: element.Unidad,
              IdUnidad: element.IdUnidad,
              isGroupBy: true
          });

          _idCentro = element.IdUnidad;
        }

        result.push({
          IdUnidad: element.IdUnidad,
          Ano: element.Ano,
          Mes: element.Mes,
          Fecha: element.Fecha,
          Version: element.Version,
          vUtilnet: element.vUtilnet,
          UltimaCircular: element.UltimaCircular,
          PeriodoRestaurado: this._processPeriodoRestaurado(element.PeriodoRestaurado)
        });
      });
    }

    return result;
  }

  private _processPeriodoRestaurado(periodo: string): string {
    if (!periodo) {
      return '';
    }

    const _periodos = periodo.split('.');
    const _periodoIni = _periodos[0].substr(6, 2) + '/' + _periodos[0].substr(4, 2) + '/' + _periodos[0].substr(0, 4);
    const _periodoFin = _periodos[1].substr(6, 2) + '/' + _periodos[1].substr(4, 2) + '/' + _periodos[1].substr(0, 4);

    return _periodoIni + ' - ' + _periodoFin;
  }

  public async getDetalleParteAtrasoDefinition(detalleAtrasosData: any): Promise<any> {
    const definition: any[] = [];

    const groupData = detalleAtrasosData.filter((d: { isGroupBy: any; }) => d.isGroupBy);

    groupData.forEach((element: { field: string; value: string; IdUnidad: any; }) => {
      if (element.field) {
        definition.push({
          text: element.field + ': ' + element.value,
          bold: true,
          margin: [0, 10, 0, 0]
        });
      }

      const data = detalleAtrasosData.filter((f: { IdUnidad: any; isGroupBy: any; }) => f.IdUnidad === element.IdUnidad && !f.isGroupBy);

      if (data.length) {
        definition.push(this._getDetalleParteAtrasoTable(data));
      }
    });

    return definition;
  }

  private _getDetalleParteAtrasoTable(parteAtrasos: any[]): any[] {
    const returnValue = [];

    returnValue.push({
      table: {
        widths: [50, 40, 60, 70, 70, 70, 120],
        body: [
          [{
            text: 'Año',
            style: 'tableHeader'
          },
          {
            text: 'Mes',
            style: 'tableHeader'
          },
          {
            text: 'Fecha',
            style: 'tableHeader'
          },
          {
            text: 'Versión Golden',
            style: 'tableHeader'
          },
          {
            text: 'Versión UtilNet',
            style: 'tableHeader'
          },
          {
            text: 'Última Circular',
            style: 'tableHeader'
          },
          {
            text: 'Período Restaurado',
            style: 'tableHeader'
          }],
          ...parteAtrasos.map((p: { Ano: any; Mes: any; Fecha: string | number | Date; Version: any; vUtilnet: any; UltimaCircular: any; PeriodoRestaurado: any; }) => {
            return [p.Ano, p.Mes,
              formatDate(p.Fecha, DateFormatEnum.ES_DATE, LocaleFormatEnum.EN_US),
              p.Version, p.vUtilnet, p.UltimaCircular, p.PeriodoRestaurado];
          })
        ],
        margin: [0, 10, 0, 0]
      }
    });

    return returnValue;
  }


}
