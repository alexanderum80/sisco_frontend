import {
  IConciliaContaInterna,
  IConciliaContaInternaQueryResponse,
} from './../models/concilia-interna-conta.model';
import { getConciliacionMonth } from '../../../shared/models/date-range';
import { numberFormatter } from './../../../shared/models/number';
import { SelectItem } from 'primeng/api';
import { conciliaInternaContaApi } from './../graphql/concilia-interna-conta.api';
import { ApolloService } from '../../../shared/helpers/apollo.service';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { toNumber } from 'lodash';
import * as moment from 'moment';

@Injectable()
export class ConciliaInternaContaService {
  fg: FormGroup = new FormGroup({
    idDivision: new FormControl('', { initialValueIsDefault: true }),
    idUnidad: new FormControl(null, { initialValueIsDefault: true }),
    idUnidadOD: new FormControl(null, { initialValueIsDefault: true }),
    periodo: new FormControl(getConciliacionMonth(new Date()), {
      initialValueIsDefault: true,
    }),
    tipoCentro: new FormControl('1', { initialValueIsDefault: true }),
    soloDiferencias: new FormControl(true, { initialValueIsDefault: true }),
  });

  subscription: Subscription[] = [];

  constructor(private _apolloSvc: ApolloService) {}

  conciliar(): Observable<IConciliaContaInternaQueryResponse> {
    return new Observable<IConciliaContaInternaQueryResponse>(subscriber => {
      const conciliaInternaContaInput = {
        annio: toNumber(
          moment(this.fg.controls['periodo'].value).format('YYYY')
        ),
        periodo: toNumber(
          moment(this.fg.controls['periodo'].value).format('MM')
        ),
        centro: toNumber(this.fg.controls['idDivision'].value),
        unidad: toNumber(this.fg.controls['idUnidad'].value),
        emisorReceptor: toNumber(this.fg.controls['idUnidadOD'].value),
      };

      this.subscription.push(
        this._apolloSvc
          .query<IConciliaContaInternaQueryResponse>(
            conciliaInternaContaApi.concilia,
            {
              conciliaInternaContaInput: conciliaInternaContaInput,
            }
          )
          .subscribe({
            next: res => {
              subscriber.next(res);
            },
            error: err => {
              subscriber.error(err.message || err);
            },
          })
      );
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
    conciliacionData: IConciliaContaInterna[]
  ): Promise<any[]> {
    const definition = [];

    if (conciliacionData.length) {
      definition.push(this._getConciliaInternaContaTable(conciliacionData));
    }

    return definition;
  }

  private _getConciliaInternaContaTable(
    conciliaInternaConta: IConciliaContaInterna[]
  ): any[] {
    let _totalValorE = 0;
    let _totalValorR = 0;
    let _totalDiferencia = 0;

    const returnValue = [];

    returnValue.push({
      table: {
        widths: [50, 50, 50, 50, 50, 80, 20, 50, 50, 80, 80],
        body: [
          [
            {
              text: 'Tipo',
              style: 'tableHeader',
            },
            {
              text: 'Emisor',
              style: 'tableHeader',
            },
            {
              text: 'Receptor',
              style: 'tableHeader',
            },
            {
              text: 'Cuenta',
              style: 'tableHeader',
            },
            {
              text: 'SubCta',
              style: 'tableHeader',
            },
            {
              text: 'Valor',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'Op.',
              style: 'tableHeader',
            },
            {
              text: 'Cuenta',
              style: 'tableHeader',
            },
            {
              text: 'SubCta',
              style: 'tableHeader',
            },
            {
              text: 'Valor',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'Diferencia',
              style: 'tableHeader',
              alignment: 'right',
            },
          ],
          ...conciliaInternaConta.map((p: IConciliaContaInterna) => {
            _totalValorE += p.ValorE;
            _totalValorR += p.ValorR;
            _totalDiferencia += p.Diferencia;

            return [
              p.Tipo,
              p.Emisor,
              p.Receptor,
              p.CuentaE,
              p.SubCuentaE,
              { text: numberFormatter.format(p.ValorE), alignment: 'right' },
              p.Operador,
              p.CuentaR,
              p.SubCuentaR,
              { text: numberFormatter.format(p.ValorR), alignment: 'right' },
              {
                text: numberFormatter.format(p.Diferencia),
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
              text: numberFormatter.format(_totalValorE),
              style: 'tableHeader',
              alignment: 'right',
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
              text: numberFormatter.format(_totalValorR),
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: numberFormatter.format(_totalDiferencia),
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
    this.subscription.forEach(subs => subs.unsubscribe);
  }
}
