import { numberFormatter } from './../../../shared/models/number';
import { uniq } from 'lodash';
import { FormGroup, FormControl } from '@angular/forms';
import {
  InformeCtasCobrarPagarQueryReponse,
  IInformeCtasCobrarPagar,
} from './../models/informe-cuentas-cobrar-pagar.model';
import { ApolloService } from '../../../shared/helpers/apollo.service';
import { Subscription, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';
import * as moment from 'moment';
import { getPreviousMonth } from '../../../shared/models';

const query = gql`
  query ContaInformeCtasCobrarPagar(
    $idDivision: Int!
    $annio: Int!
    $periodo: Int!
  ) {
    contaInformeCtasCobrarPagar(
      idDivision: $idDivision
      annio: $annio
      periodo: $periodo
    ) {
      Division
      Organismo
      Grupo
      Cuenta
      ProveedorCliente
      Saldo
      Hasta30
      De30a60
      De60a90
      MasDe90
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class InformeCuentasCobrarPagarService {
  fg: FormGroup = new FormGroup({
    idDivision: new FormControl(null, { initialValueIsDefault: true }),
    periodo: new FormControl(getPreviousMonth(new Date()), {
      initialValueIsDefault: true,
    }),
  });

  subscription: Subscription[] = [];

  informeCuentasCobrarPagar: IInformeCtasCobrarPagar[] = [];

  totalMontoGrupo = 0;
  totalHasta30Grupo = 0;
  totalDe30a60Grupo = 0;
  totalDe60a90Grupo = 0;
  totalMasDe90Grupo = 0;

  constructor(private _apolloSvc: ApolloService) {}

  getInformeCuentasCobrarPagar(): Observable<InformeCtasCobrarPagarQueryReponse> {
    const idDivision = +this.fg.get('idDivision')?.value;
    const annio = +moment(this.fg.get('periodo')?.value).format('YYYY');
    const periodo = +moment(this.fg.get('periodo')?.value).format('MM');

    return new Observable<InformeCtasCobrarPagarQueryReponse>(observer => {
      this._apolloSvc
        .query<InformeCtasCobrarPagarQueryReponse>(query, {
          idDivision,
          annio,
          periodo,
        })
        .subscribe({
          next: res => {
            observer.next(res);
          },
          error: err => {
            observer.error(err);
          },
        });
    });
  }

  async getDivision(): Promise<any> {
    const definition = [];

    const _division = uniq(this.informeCuentasCobrarPagar.map(u => u.Division));

    definition.push({
      text: `División:  ${_division} `,
      bold: true,
      margin: [0, 5, 0, 0],
    });

    return definition;
  }

  async getInformeCuentasCobrarPagarDefinition(): Promise<any> {
    const definition: any[] = [];

    const organismos = uniq(
      this.informeCuentasCobrarPagar.map(d => d.Organismo)
    );

    organismos.forEach(organismo => {
      definition.push({
        text: organismo,
        bold: true,
        italics: true,
        decoration: 'underline',
        margin: [0, 10, 0, 0],
      });

      const grupos = uniq(
        this.informeCuentasCobrarPagar
          .filter(f => f.Organismo === organismo)
          .map(d => d.Grupo)
      );

      grupos.forEach(grupo => {
        this.totalMontoGrupo = 0;
        this.totalHasta30Grupo = 0;
        this.totalDe30a60Grupo = 0;
        this.totalDe60a90Grupo = 0;
        this.totalMasDe90Grupo = 0;

        definition.push({
          text: grupo,
          bold: true,
          decoration: 'underline',
          margin: [0, 10, 0, 0],
        });

        const cuentas = uniq(
          this.informeCuentasCobrarPagar
            .filter(f => f.Organismo === organismo && f.Grupo === grupo)
            .map(d => d.Cuenta)
        );

        cuentas.forEach(cuenta => {
          definition.push({
            text: cuenta,
            bold: true,
            margin: [0, 10, 0, 0],
          });

          const _filteredData = this.informeCuentasCobrarPagar.filter(
            f =>
              f.Organismo === organismo &&
              f.Grupo === grupo &&
              f.Cuenta === cuenta
          );

          definition.push(this._getInformeCtaCobrarPagarTable(_filteredData));
        });

        definition.push(this._getTotalesGrupoTabla());
      });
    });

    return definition;
  }

  private _getInformeCtaCobrarPagarTable(
    data: IInformeCtasCobrarPagar[]
  ): object {
    let totalMonto = 0;
    let totalHasta30 = 0;
    let totalDe30a60 = 0;
    let totalDe60a90 = 0;
    let totalMasDe90 = 0;

    const returnValue = {
      table: {
        widths: [90, 77, 77, 77, 77, 77],
        body: [
          [
            {
              text: 'Cliente / Proveedor',
              style: 'tableHeader',
            },
            {
              text: 'Monto',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'Hasta 30 Días',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'De 31 a 60 Días',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'De 61 a 90 Días',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'Más de 90 Días',
              style: 'tableHeader',
              alignment: 'right',
            },
          ],
          ...data.map((al: IInformeCtasCobrarPagar) => {
            totalMonto += al.Saldo;
            totalHasta30 += al.Hasta30;
            totalDe30a60 += al.De30a60;
            totalDe60a90 += al.De60a90;
            totalMasDe90 += al.MasDe90;

            this.totalMontoGrupo += al.Saldo;
            this.totalHasta30Grupo += al.Hasta30;
            this.totalDe30a60Grupo += al.De30a60;
            this.totalDe60a90Grupo += al.De60a90;
            this.totalMasDe90Grupo += al.MasDe90;

            return [
              al.ProveedorCliente,
              {
                text: numberFormatter.format(al.Saldo),
                alignment: 'right',
              },
              {
                text: numberFormatter.format(al.Hasta30),
                alignment: 'right',
              },
              {
                text: numberFormatter.format(al.De30a60),
                alignment: 'right',
              },
              {
                text: numberFormatter.format(al.De60a90),
                alignment: 'right',
              },
              {
                text: numberFormatter.format(al.MasDe90),
                alignment: 'right',
              },
            ];
          }),
          [
            { text: 'TOTAL CUENTA', bold: true },
            {
              text: numberFormatter.format(totalMonto),
              bold: true,
              alignment: 'right',
            },
            {
              text: numberFormatter.format(totalHasta30),
              bold: true,
              alignment: 'right',
            },
            {
              text: numberFormatter.format(totalDe30a60),
              bold: true,
              alignment: 'right',
            },
            {
              text: numberFormatter.format(totalDe60a90),
              bold: true,
              alignment: 'right',
            },
            {
              text: numberFormatter.format(totalMasDe90),
              bold: true,
              alignment: 'right',
            },
          ],
        ],
      },
    };

    return returnValue;
  }

  private _getTotalesGrupoTabla(): object {
    const returnValue = {
      table: {
        margin: [0, 10, 0, 0],
        widths: [90, 77, 77, 77, 77, 77],
        body: [
          [
            { text: 'TOTAL GENERAL', bold: true },
            {
              text: numberFormatter.format(this.totalMontoGrupo),
              bold: true,
              alignment: 'right',
            },
            {
              text: numberFormatter.format(this.totalHasta30Grupo),
              bold: true,
              alignment: 'right',
            },
            {
              text: numberFormatter.format(this.totalDe30a60Grupo),
              bold: true,
              alignment: 'right',
            },
            {
              text: numberFormatter.format(this.totalDe60a90Grupo),
              bold: true,
              alignment: 'right',
            },
            {
              text: numberFormatter.format(this.totalMasDe90Grupo),
              bold: true,
              alignment: 'right',
            },
          ],
        ],
      },
    };

    return returnValue;
  }

  dispose(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}
