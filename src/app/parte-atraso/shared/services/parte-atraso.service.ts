import { ParteAtrasosQueryResponse } from './../models/parte-atraso.model';
import { Apollo } from 'apollo-angular';
import { DateFormatEnum, LocaleFormatEnum } from './../../../shared/models/date-range';
import { formatDate } from '@angular/common';
import { toNumber, uniqBy } from 'lodash';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';

const parteAtrasosQuery = require('graphql-tag/loader!../graphql/parte-atrasos.query.gql');

@Injectable()
export class ParteAtrasoService {
  fg: FormGroup = new FormGroup({
    idDivision: new FormControl(null)
  });

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo,
  ) { }

  calcular(): Observable<ParteAtrasosQueryResponse> {
    const idDivision = toNumber(this.fg.controls['idDivision'].value);

    return new Observable<ParteAtrasosQueryResponse>(subscriber => {
      this._apollo.query<ParteAtrasosQueryResponse>({
        query: parteAtrasosQuery,
        variables: { idDivision },
        fetchPolicy: 'network-only'
      }).subscribe(reponse => {
        subscriber.next(reponse.data);
      })
    })
  }

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

  public async getDetalleParteAtrasoDefinition(detalleAtrasosData: any): Promise<any> {
    const definition: any[] = [];

    const unidades = uniqBy(detalleAtrasosData, 'IdUnidad');

    unidades.forEach((u: any) => {
      definition.push({
        text: 'Unidad: ' + u.Unidad,
        bold: true,
        margin: [0, 10, 0, 0]
      });

      const data = detalleAtrasosData.filter((f: { IdUnidad: string }) => f.IdUnidad === u.IdUnidad);

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

  dispose(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

}
