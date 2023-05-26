import { formatDate } from '@angular/common';
import {
  DateFormatEnum,
  LocaleFormatEnum,
} from '../../../shared/models/date-range';
import { SelectItem } from 'primeng/api';
import { ApolloService } from '../../../shared/helpers/apollo.service';
import {
  IParteEstadisticaContabilidad,
  IParteEstadisticaContabilidadReponse,
} from '../models/parte-estadistica-contabilidad.model';
import { Observable, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { uniqBy } from 'lodash';
import { FormControl, FormGroup } from '@angular/forms';

const parteEstadisticaQuery = require('graphql-tag/loader!../graphql/parte-estadistica-contabilidad.query.gql');

@Injectable()
export class ParteEstadisticaContabilidadService {
  fg: FormGroup = new FormGroup({
    idDivision: new FormControl(0, { initialValueIsDefault: true }),
  });

  subscription: Subscription[] = [];

  constructor(private _apolloSvc: ApolloService) {}

  getEstadistica(): Observable<IParteEstadisticaContabilidad[]> {
    return new Observable<IParteEstadisticaContabilidad[]>(subscriber => {
      this._apolloSvc
        .query<IParteEstadisticaContabilidadReponse>(parteEstadisticaQuery)
        .subscribe({
          next: res => {
            subscriber.next(res.contaEstadisticaParte);
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
    conciliaInternaConta: IParteEstadisticaContabilidad[]
  ): Promise<any[]> {
    const returnValue = [];

    const divisiones = uniqBy(conciliaInternaConta, 'Division');

    for (let i = 0; i < divisiones.length; i++) {
      const division = divisiones[i];

      const filteredData = conciliaInternaConta.filter(
        f => f.Division === division.Division
      );

      let _totalComprobantes = 0;
      let _totalTraspasdos = 0;
      let _totalSinTraspasar = 0;
      let _totalInconclusos = 0;
      let _totalAnulados = 0;

      returnValue.push({
        text: 'División: ' + division.Division,
        bold: true,
        margin: [0, 10, 0, 0],
      });

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
            ...filteredData.map((p: IParteEstadisticaContabilidad) => {
              _totalComprobantes += p.Comprobantes;
              _totalTraspasdos += p.Traspasados;
              _totalSinTraspasar += p.SinTraspasar;
              _totalInconclusos += p.Inconclusos;
              _totalAnulados += p.Anulados;

              return [
                {
                  text: p.Centro,
                  color: p.Conexion !== 'Conectado' ? 'red' : 'black',
                },
                {
                  text: p.Consolidado ? 'X' : '',
                  alignment: 'center',
                  color: p.Conexion !== 'Conectado' ? 'red' : 'black',
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
                  color: p.Conexion !== 'Conectado' ? 'red' : 'black',
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
                  color: p.Conexion !== 'Conectado' ? 'red' : 'black',
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
                  color: p.Conexion !== 'Conectado' ? 'red' : 'black',
                },
                {
                  text: p.Comprobantes,
                  alignment: 'right',
                  color: p.Conexion !== 'Conectado' ? 'red' : 'black',
                },
                {
                  text: p.Traspasados,
                  alignment: 'right',
                  color: p.Conexion !== 'Conectado' ? 'red' : 'black',
                },
                {
                  text: p.SinTraspasar,
                  alignment: 'right',
                  color: p.Conexion !== 'Conectado' ? 'red' : 'black',
                },
                {
                  text: p.Inconclusos,
                  alignment: 'right',
                  color: p.Conexion !== 'Conectado' ? 'red' : 'black',
                },
                {
                  text: p.Anulados,
                  alignment: 'right',
                  color: p.Conexion !== 'Conectado' ? 'red' : 'black',
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
    }

    return returnValue;
  }

  dispose(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}
