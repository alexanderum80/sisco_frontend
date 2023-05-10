import { formatDate } from '@angular/common';
import {
  DateFormatEnum,
  LocaleFormatEnum,
  getConciliacionMonth,
} from './../../../shared/models/date-range';
import { SelectItem } from 'primeng/api';
import { FormGroup, FormControl } from '@angular/forms';
import { ApolloService } from '../../../shared/helpers/apollo.service';
import {
  IEstadisticaContabilidad,
  IEstadisticaContabilidadReponse,
} from './../models/estadistica-contabilidad.model';
import { Observable, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

const estadisticaQuery = require('graphql-tag/loader!../graphql/estadistica-contabilidad.query.gql');

@Injectable()
export class EstadisticaContabilidadService {
  fg: FormGroup = new FormGroup({
    idDivision: new FormControl('', { initialValueIsDefault: true }),
    periodo: new FormControl(getConciliacionMonth(new Date()), {
      initialValueIsDefault: true,
    }),
  });

  subscription: Subscription[] = [];

  constructor(private _apolloSvc: ApolloService) {}

  getEstadistica(): Observable<IEstadisticaContabilidad[]> {
    const contaEstadisticaInput = {
      idDivision: this.fg.get('idDivision')?.value,
      annio: Number(moment(this.fg.get('periodo')?.value).format('YYYY')),
      periodo: Number(moment(this.fg.get('periodo')?.value).format('MM')),
    };

    return new Observable<IEstadisticaContabilidad[]>(subscriber => {
      this._apolloSvc
        .query<IEstadisticaContabilidadReponse>(estadisticaQuery, {
          contaEstadisticaInput,
        })
        .subscribe({
          next: res => {
            subscriber.next(res.contaEstadistica);
          },
          error: err => {
            subscriber.error(err.message || err);
          },
        });
    });
  }

  public async getDivision(
    idDivision: number,
    divisionesList: SelectItem[]
  ): Promise<any> {
    const definition = [];

    const _division = divisionesList.find(u => u.value === idDivision);

    definition.push({
      text: `División:  ${_division?.label} `,
      bold: true,
      margin: [0, 5, 0, 0],
    });

    return definition;
  }

  public async getConciliacionDefinition(
    conciliaInternaConta: IEstadisticaContabilidad[]
  ): Promise<any[]> {
    let _totalComprobantes = 0;
    let _totalTraspasdos = 0;
    let _totalSinTraspasar = 0;
    let _totalInconclusos = 0;
    let _totalAnulados = 0;

    const returnValue = [];

    returnValue.push({
      table: {
        widths: [150, 25, 60, 50, 50, 60, 55, 60, 50, 50],
        body: [
          [
            {
              text: 'Centro',
              style: 'tableHeader',
            },
            {
              text: 'Cons.',
              style: 'tableHeader',
              alignment: 'center',
            },
            {
              text: 'Fecha Actualización',
              style: 'tableHeader',
              alignment: 'center',
            },
            {
              text: 'Fecha Inicio',
              style: 'tableHeader',
              alignment: 'center',
            },
            {
              text: 'Fecha Fin',
              style: 'tableHeader',
              alignment: 'center',
            },
            {
              text: 'Comprobantes',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'Traspasados',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'Sin Traspasar',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'Inconclusos',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'Anulados',
              style: 'tableHeader',
              alignment: 'right',
            },
          ],
          ...conciliaInternaConta.map((p: IEstadisticaContabilidad) => {
            _totalComprobantes += p.Comprobantes;
            _totalTraspasdos += p.Traspasados;
            _totalSinTraspasar += p.SinTraspasar;
            _totalInconclusos += p.Inconclusos;
            _totalAnulados += p.Anulados;

            return [
              p.Centro,
              {
                text: p.Consolidado ? 'X' : '',
                alignment: 'center',
              },
              {
                text: p.FechaActualizacion
                  ? formatDate(
                      p.FechaActualizacion,
                      DateFormatEnum.ES_DATE_HOUR_M,
                      LocaleFormatEnum.EN_US
                    )
                  : '',
                alignment: 'center',
              },
              {
                text: p.FechaInicio
                  ? formatDate(
                      p.FechaInicio,
                      DateFormatEnum.ES_DATE,
                      LocaleFormatEnum.EN_US
                    )
                  : '',
                alignment: 'center',
              },
              {
                text: p.FechaFin
                  ? formatDate(
                      p.FechaFin,
                      DateFormatEnum.ES_DATE,
                      LocaleFormatEnum.EN_US
                    )
                  : '',
                alignment: 'center',
              },
              {
                text: p.Comprobantes,
                alignment: 'right',
              },
              {
                text: p.Traspasados,
                alignment: 'right',
              },
              {
                text: p.SinTraspasar,
                alignment: 'right',
              },
              {
                text: p.Inconclusos,
                alignment: 'right',
              },
              {
                text: p.Anulados,
                alignment: 'right',
              },
            ];
          }),
          // total row
          [
            {
              text: 'TOTAL',
              style: 'tableHeader',
            },
            {
              text: '',
              style: 'tableHeader',
            },
            {
              text: '',
              style: 'tableHeader',
            },
            {
              text: '',
              style: 'tableHeader',
            },
            {
              text: '',
              style: 'tableHeader',
            },
            {
              text: _totalComprobantes,
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: _totalTraspasdos,
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: _totalSinTraspasar,
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: _totalInconclusos,
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: _totalAnulados,
              style: 'tableHeader',
              alignment: 'right',
            },
          ],
        ],
        margin: [0, 10, 0, 0],
      },
    });

    return returnValue;
  }

  dispose(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}
