import { numberFormatter } from './../../../shared/models/number';
import {
  IConciliaExternaContabQueryReponse,
  ConciliaExternaContabMutationReponse,
  IConciliaContab,
  IActaConciliacion,
  IConciliaContabResumen,
} from './../models/concilia-externa.model';
import { conciliaExternaContaAPI } from './../graphql/concilia-externa-conta-api';
import { Observable } from 'rxjs';
import { ApolloService } from './../../../shared/services/apollo.service';
import { PdfmakeService } from '../../../shared/services/pdfmake.service';
import { SelectItem } from 'primeng/api';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import { getMonthName } from 'src/app/shared/models/date-range';

@Injectable()
export class ConciliaExternaContaService {
  constructor(
    private datePipe: DatePipe,
    private _pdfMakeSvc: PdfmakeService,
    private _apollo: ApolloService
  ) {}

  today = new Date(moment().toDate());

  fg = new FormGroup({
    division: new FormControl('0', {
      initialValueIsDefault: true,
    }),
    unidad: new FormControl('0', { initialValueIsDefault: true }),
    divisionOD: new FormControl('0', { initialValueIsDefault: true }),
    unidadOD: new FormControl('0', { initialValueIsDefault: true }),
    periodo: new FormControl(moment(this.today).subtract(1, 'month').toDate(), {
      initialValueIsDefault: true,
    }),
    usuarioEmisor: new FormControl(null, { initialValueIsDefault: true }),
    cargoEmisor: new FormControl('', { initialValueIsDefault: true }),
    usuarioReceptor: new FormControl(null, { initialValueIsDefault: true }),
    cargoReceptor: new FormControl('', { initialValueIsDefault: true }),
    usuarioSupervisor: new FormControl(null, { initialValueIsDefault: true }),
    cargoSupervisor: new FormControl('', { initialValueIsDefault: true }),
    nota: new FormControl('', { initialValueIsDefault: true }),
  });

  private _conciliaContabRowData: IConciliaContab[] = [];
  private _conciliaContabResumenRowData: IConciliaContabResumen[] = [];
  private _actaConciliacionEmisorRowData: IActaConciliacion[] = [];
  private _actaConciliacionReceptorRowData: IActaConciliacion[] = [];
  private _diferenciasConciliacionRowData = [];
  private _centrosNoConciliadosRowData = [];
  private _ConciliacionEntreUnidadesData = [];
  private _ConciliacionEntreUnidadesEmisorRowData = [];
  private _ConciliacionEntreUnidadesReceptorRowData = [];

  private _actaConciliaUsuariosEmisorList: SelectItem[] = [];
  private _actaConciliaUsuariosReceptorList: SelectItem[] = [];
  private _actaConciliaUsuariosSupervisorList: SelectItem[] = [];

  set ConciliaContabRowData(data: IConciliaContab[]) {
    this._conciliaContabRowData = data;
  }

  get ConciliaContabRowData(): IConciliaContab[] {
    return this._conciliaContabRowData;
  }

  set ConciliaContabResumenRowData(data: IConciliaContabResumen[]) {
    this._conciliaContabResumenRowData = data;
  }

  get ConciliaContabResumenRowData(): IConciliaContabResumen[] {
    return this._conciliaContabResumenRowData;
  }

  set ActaConciliacionEmisorRowData(data: any) {
    this._actaConciliacionEmisorRowData = data;
  }

  get ActaConciliacionEmisorRowData() {
    return this._actaConciliacionEmisorRowData;
  }

  set ActaConciliacionReceptorRowData(data: any) {
    this._actaConciliacionReceptorRowData = data;
  }

  get ActaConciliacionReceptorRowData() {
    return this._actaConciliacionReceptorRowData;
  }

  set DiferenciasConciliacionRowData(data: any) {
    this._diferenciasConciliacionRowData = data;
  }

  get DiferenciasConciliacionRowData() {
    return this._diferenciasConciliacionRowData;
  }

  set CentrosNoConciliadosRowData(data: any) {
    this._centrosNoConciliadosRowData = data;
  }

  get CentrosNoConciliadosRowData() {
    return this._centrosNoConciliadosRowData;
  }

  set ConciliacionEntreUnidadesData(data: any) {
    this._ConciliacionEntreUnidadesData = data;
  }

  get ConciliacionEntreUnidadesData() {
    return this._ConciliacionEntreUnidadesData;
  }

  set ConciliacionEntreUnidadesEmisorRowData(data: any) {
    this._ConciliacionEntreUnidadesEmisorRowData = data;
  }

  get ConciliacionEntreUnidadesEmisorRowData() {
    return this._ConciliacionEntreUnidadesEmisorRowData;
  }

  set ConciliacionEntreUnidadesReceptorRowData(data: any) {
    this._ConciliacionEntreUnidadesReceptorRowData = data;
  }

  get ConciliacionEntreUnidadesReceptorRowData() {
    return this._ConciliacionEntreUnidadesReceptorRowData;
  }

  set ActaConciliacionUsuariosEmisorList(data: SelectItem[]) {
    this._actaConciliaUsuariosEmisorList = data;
  }

  get ActaConciliacionUsuariosEmisorList(): SelectItem[] {
    return this._actaConciliaUsuariosEmisorList;
  }

  set ActaConciliacionUsuariosReceptorList(data) {
    this._actaConciliaUsuariosReceptorList = data;
  }

  get ActaConciliacionUsuariosReceptorList() {
    return this._actaConciliaUsuariosReceptorList;
  }

  set ActaConciliacionUsuariosSupervisorList(data) {
    this._actaConciliaUsuariosSupervisorList = data;
  }

  get ActaConciliacionUsuariosSupervisorList() {
    return this._actaConciliaUsuariosSupervisorList;
  }

  public calculaConciliacion(): Observable<IConciliaExternaContabQueryReponse> {
    const controls = this.fg.controls;

    const payload = {
      Annio: +moment(controls['periodo'].value).format('YYYY'),
      Mes: +moment(controls['periodo'].value).format('MM'),
      Division: +controls['division'].value.IdDivision || 0,
      Unidad: +controls['unidad'].value.IdUnidad || 0,
      DivisionOD: +controls['divisionOD'].value.IdDivision || 0,
      UnidadOD: +controls['unidadOD'].value.IdUnidad || 0,
    };

    return new Observable<IConciliaExternaContabQueryReponse>(subscriber => {
      this._apollo
        .watchQuery<IConciliaExternaContabQueryReponse>(
          conciliaExternaContaAPI.conciliacion,
          {
            conciliaExternaInput: payload,
          }
        )
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

  public calculaConciliacionResumen(): Observable<IConciliaExternaContabQueryReponse> {
    const controls = this.fg.controls;

    const payload = {
      Annio: +moment(controls['periodo'].value).format('YYYY'),
      Mes: +moment(controls['periodo'].value).format('MM'),
    };

    return new Observable<IConciliaExternaContabQueryReponse>(subscriber => {
      this._apollo
        .watchQuery<IConciliaExternaContabQueryReponse>(
          conciliaExternaContaAPI.conciliacionResumen,
          {
            annio: payload.Annio,
            mes: payload.Mes,
          }
        )
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

  public getDatosConciliacion(): Observable<IConciliaExternaContabQueryReponse> {
    const payload = this.fg.controls;

    return new Observable<IConciliaExternaContabQueryReponse>(subscriber => {
      this._apollo
        .watchQuery<IConciliaExternaContabQueryReponse>(
          conciliaExternaContaAPI.datosConciliacion,
          {
            anno: +moment(payload['periodo'].value).format('YYYY'),
            mes: +moment(payload['periodo'].value).format('MM'),
          }
        )
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

  public iniciarConciliacion(): Observable<ConciliaExternaContabMutationReponse> {
    const payload = this.fg.controls;
    return new Observable<ConciliaExternaContabMutationReponse>(subscriber => {
      this._apollo
        .mutation<ConciliaExternaContabMutationReponse>(
          conciliaExternaContaAPI.inicializarConciliacion,
          {
            annio: +moment(payload['periodo'].value).format('YYYY'),
            mes: +moment(payload['periodo'].value).format('MM'),
          },
          ['DatosConciliacion']
        )
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

  public cerrarConciliacion(): Observable<ConciliaExternaContabMutationReponse> {
    const payload = this.fg.controls;
    return new Observable<ConciliaExternaContabMutationReponse>(subscriber => {
      this._apollo
        .mutation<ConciliaExternaContabMutationReponse>(
          conciliaExternaContaAPI.cerrarConciliacion,
          {
            anno: +moment(payload['periodo'].value).format('YYYY'),
            mes: +moment(payload['periodo'].value).format('MM'),
          }
        )
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

  public reabrirConciliacion(): Observable<ConciliaExternaContabMutationReponse> {
    const payload = this.fg.controls;
    return new Observable<ConciliaExternaContabMutationReponse>(subscriber => {
      this._apollo
        .mutation<ConciliaExternaContabMutationReponse>(
          conciliaExternaContaAPI.reabrirConciliacion,
          {
            anno: +moment(payload['periodo'].value).format('YYYY'),
            mes: +moment(payload['periodo'].value).format('MM'),
          }
        )
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

  public diferenciasConciliacion(): Observable<IConciliaExternaContabQueryReponse> {
    const payload = this.fg.controls;
    return new Observable<IConciliaExternaContabQueryReponse>(subscriber => {
      this._apollo
        .query<IConciliaExternaContabQueryReponse>(
          conciliaExternaContaAPI.diferenciasConciliacion,
          {
            annio: +moment(payload['periodo'].value).format('YYYY'),
            mes: +moment(payload['periodo'].value).format('MM'),
          }
        )
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

  public centrosNoConciliados(): Observable<IConciliaExternaContabQueryReponse> {
    const payload = this.fg.controls;
    return new Observable<IConciliaExternaContabQueryReponse>(subscriber => {
      this._apollo
        .query<IConciliaExternaContabQueryReponse>(
          conciliaExternaContaAPI.centrosNoConciliados,
          {
            annio: +moment(payload['periodo'].value).format('YYYY'),
            mes: +moment(payload['periodo'].value).format('MM'),
          }
        )
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

  public conciliacionEntreUnidadesEmisor(): Observable<IConciliaExternaContabQueryReponse> {
    const payload = this.fg.controls;
    return new Observable<IConciliaExternaContabQueryReponse>(subscriber => {
      this._apollo
        .query<IConciliaExternaContabQueryReponse>(
          conciliaExternaContaAPI.conciliacionEntreUnidades,
          {
            annio: +moment(payload['periodo'].value).format('YYYY'),
            mes: +moment(payload['periodo'].value).format('MM'),
            unidad: +payload['unidad'].value.IdUnidad || 0,
            unidadOD: +payload['unidadOD'].value.IdUnidad || 0,
          }
        )
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

  public conciliacionEntreUnidadesReceptor(): Observable<IConciliaExternaContabQueryReponse> {
    const payload = this.fg.controls;
    return new Observable<IConciliaExternaContabQueryReponse>(subscriber => {
      this._apollo
        .query<IConciliaExternaContabQueryReponse>(
          conciliaExternaContaAPI.conciliacionEntreUnidades,
          {
            annio: +moment(payload['periodo'].value).format('YYYY'),
            mes: +moment(payload['periodo'].value).format('MM'),
            unidad: +payload['unidadOD'].value.IdUnidad || 0,
            unidadOD: +payload['unidad'].value.IdUnidad || 0,
          }
        )
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

  // acta de conciliacion
  private _getPeriodoConciliacion(_alignment = 'center') {
    return {
      columns: [
        {
          text: `PERIODO A CONCILIAR: ${this._getPeriodo()}`,
          style: 'bold',
          alignment: _alignment,
          margin: [0, 10, 0, 10],
        },
      ],
    };
  }

  private _getDatosEmisorActa() {
    const emisor = this.fg.get('unidad')?.value
      ? this.fg.get('unidad')?.value?.Nombre +
        ' (' +
        this.fg.get('unidad')?.value?.IdDivision +
        ')'
      : '';

    const receptor = this.fg.get('unidadOD')?.value
      ? this.fg.get('unidadOD')?.value?.Nombre +
        ' (' +
        this.fg.get('unidadOD')?.value?.IdDivision +
        ')'
      : '';

    return {
      columns: [
        [
          {
            text: `EMISOR:      ${emisor}`,
            style: 'bold',
          },
          {
            text: `RECEPTOR: ${receptor}`,
            style: 'bold',
            margin: [0, 0, 0, 10],
          },
        ],
        [
          {
            text: 'Cuenta: 135/0040',
            style: 'bold',
            alignment: 'right',
          },
          {
            text: 'Cuenta: 405/0040',
            style: 'bold',
            alignment: 'right',
            margin: [0, 0, 0, 20],
          },
        ],
      ],
    };
  }

  private _getDatosReceptorActa() {
    const emisor = this.fg.get('unidadOD')?.value
      ? this.fg.get('unidadOD')?.value?.Nombre +
        ' (' +
        this.fg.get('unidadOD')?.value?.IdDivision +
        ')'
      : '';
    const receptor = this.fg.get('unidad')?.value
      ? this.fg.get('unidad')?.value?.Nombre +
        ' (' +
        this.fg.get('unidad')?.value?.IdDivision +
        ')'
      : '';

    return {
      columns: [
        [
          {
            text: `EMISOR:      ${emisor}`,
            style: 'bold',
          },
          {
            text: `RECEPTOR: ${receptor}`,
            style: 'bold',
            margin: [0, 0, 0, 10],
          },
        ],
        [
          {
            text: 'Cuenta: 135/0040',
            style: 'bold',
            alignment: 'right',
          },
          {
            text: 'Cuenta: 405/0040',
            style: 'bold',
            alignment: 'right',
            margin: [0, 0, 0, 20],
          },
        ],
      ],
    };
  }

  private async _getActaConciliacionEmisor() {
    return {
      table: {
        headerRows: 1,
        widths: ['*', 80, 80, 80],
        body: [
          [
            {
              text: 'DETALLE',
              style: 'bold',
            },
            {
              text: 'EMISOR',
              style: 'bold',
              alignment: 'right',
            },
            {
              text: 'RECEPTOR',
              style: 'bold',
              alignment: 'right',
            },
            {
              text: 'DIFERENCIA',
              style: 'bold',
              alignment: 'right',
            },
          ],
          ...this.ActaConciliacionEmisorRowData.map(
            (item: IActaConciliacion) => {
              return [
                item.Detalle,
                {
                  text: numberFormatter.format(item.SaldoEmisor),
                  alignment: 'right',
                },
                {
                  text: numberFormatter.format(item.SaldoReceptor),
                  alignment: 'right',
                },
                {
                  text: numberFormatter.format(item.Diferencia),
                  alignment: 'right',
                },
              ];
            }
          ),
        ],
      },
    };
  }

  private async _getActaConciliacionReceptor() {
    return {
      table: {
        headerRows: 1,
        widths: ['*', 80, 80, 80],
        body: [
          [
            {
              text: 'DETALLE',
              style: 'bold',
            },
            {
              text: 'EMISOR',
              style: 'bold',
              alignment: 'right',
            },
            {
              text: 'RECEPTOR',
              style: 'bold',
              alignment: 'right',
            },
            {
              text: 'DIFERENCIA',
              style: 'bold',
              alignment: 'right',
            },
          ],
          ...this.ActaConciliacionReceptorRowData.map(
            (item: IActaConciliacion) => {
              return [
                item.Detalle,
                {
                  text: numberFormatter.format(item.SaldoEmisor),
                  alignment: 'right',
                },
                {
                  text: numberFormatter.format(item.SaldoReceptor),
                  alignment: 'right',
                },
                {
                  text: numberFormatter.format(item.Diferencia),
                  alignment: 'right',
                },
              ];
            }
          ),
        ],
      },
    };
  }

  private _getPieDeFirmaEmisor() {
    return {
      columns: [
        [
          {
            text: 'Por el emisor:',
            style: 'bold',
            margin: [0, 40, 0, 0],
          },
          {
            text: `Nombre y Apellidos: ${
              this.fg.get('usuarioEmisor')?.value?.Empleado || ''
            }`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Cargo:                         ${this.fg.controls['cargoEmisor'].value}`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Firma:                         _______________________`,
            margin: [0, 10, 0, 0],
          },
        ],
        [
          {
            text: 'Por el Receptor:',
            style: 'bold',
            margin: [0, 40, 0, 0],
          },
          {
            text: `Nombre y Apellidos: ${
              this.fg.get('usuarioReceptor')?.value?.Empleado || ''
            }`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Cargo:                         ${this.fg.controls['cargoReceptor'].value}`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Firma:                         _______________________`,
            margin: [0, 10, 0, 0],
          },
        ],
      ],
    };
  }

  private _getPieDeFirmaReceptor() {
    return {
      columns: [
        [
          {
            text: 'Por el emisor:',
            style: 'bold',
            margin: [0, 40, 0, 0],
          },
          {
            text: `Nombre y Apellidos: ${
              this.fg.get('usuarioReceptor')?.value?.Empleado || ''
            }`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Cargo:                         ${this.fg.controls['cargoReceptor'].value}`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Firma:                         _______________________`,
            margin: [0, 10, 0, 0],
          },
        ],
        [
          {
            text: 'Por el Receptor:',
            style: 'bold',
            margin: [0, 40, 0, 0],
          },
          {
            text: `Nombre y Apellidos: ${
              this.fg.get('usuarioEmisor')?.value?.Empleado || ''
            }`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Cargo:                         ${this.fg.controls['cargoEmisor'].value}`,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Firma:                         _______________________`,
            margin: [0, 10, 0, 0],
          },
        ],
      ],
    };
  }

  private _getPieDeFirmaSupervisor() {
    return {
      columns: [
        [
          {
            text: 'Por el supervisor:',
            style: 'bold',
            margin: [150, 40, 0, 0],
          },
          {
            text: `Nombre y Apellidos: ${
              this.fg.get('usuarioSupervisor')?.value?.Empleado || ''
            }`,
            margin: [150, 10, 0, 0],
          },
          {
            text: `Cargo:                         ${this.fg.controls['cargoSupervisor'].value}`,
            margin: [150, 10, 0, 0],
          },
          {
            text: `Firma:                         _______________________`,
            margin: [150, 10, 0, 0],
          },
        ],
      ],
    };
  }

  private _getNota() {
    return {
      columns: [
        [
          {
            text: 'Observaciones:',
            style: 'bold',
            margin: [0, 20, 0, 10],
            decoration: 'underline',
          },
          {
            text: this.fg.controls['nota'].value
              ? this.fg.controls['nota'].value
              : '',
          },
        ],
      ],
    };
  }

  private _getPeriodo() {
    return (
      getMonthName(+moment(this.fg.get('periodo')?.value).format('MM')) +
      '/' +
      moment(this.fg.get('periodo')?.value).format('YYYY')
    );
  }

  // reportes de la conciliacion
  public async getPdfDefinition(reportName: string, selectedTab: number) {
    switch (selectedTab) {
      case 0: // Conciliación Contabilidad
        return {
          info: {
            title:
              'Reporte de Conciliación Externa por la Contabilidad | SISCO',
          },
          pageSize: 'LETTER',
          pageOrientation: 'landscape',
          content: [
            await this._pdfMakeSvc.getHeaderDefinition(reportName),
            await this._getEmisorReceptorReporte(),
            await this._getPeriodoConciliacion('left'),
            await this._getConciliaContab(),
          ],
          defaultStyle: {
            fontSize: 9,
          },
          styles: {
            tableHeader: {
              bold: true,
            },
          },
        };
      case 1: // Acta Emisor
        return {
          info: {
            title: 'Acta de Conciliación Externa por la Contabilidad | SISCO',
          },
          pageSize: 'LETTER',
          content: [
            await this._pdfMakeSvc.getHeaderDefinition(reportName),
            this._getPeriodoConciliacion(),
            this._getDatosEmisorActa(),
            await this._getActaConciliacionEmisor(),
            this._getPieDeFirmaEmisor(),
            this._getPieDeFirmaSupervisor(),
            this._getNota(),
          ],
          defaultStyle: {
            fontSize: 10,
            lineHeight: 1.3,
          },
          styles: {
            bold: {
              bold: true,
            },
          },
        };
      case 2: // Acta Receptor
        return {
          info: {
            title: 'Acta de Conciliación Externa por la Contabilidad | SISCO',
          },
          pageSize: 'LETTER',
          content: [
            await this._pdfMakeSvc.getHeaderDefinition(reportName),
            this._getPeriodoConciliacion(),
            this._getDatosReceptorActa(),
            await this._getActaConciliacionReceptor(),
            this._getPieDeFirmaReceptor(),
            this._getPieDeFirmaSupervisor(),
            this._getNota(),
          ],
          defaultStyle: {
            fontSize: 10,
            lineHeight: 1.3,
          },
          styles: {
            bold: {
              bold: true,
            },
          },
        };
      case 10: // Deudas Resumen
        return {
          info: {
            title:
              'Deudas Resumen en Conciliación Externa por la Contabilidad | SISCO',
          },
          pageSize: 'LETTER',
          pageOrientation: 'landscape',
          content: [
            await this._pdfMakeSvc.getHeaderDefinition(reportName),
            {
              columns: [
                {
                  text: `PERIODO: ${this._getPeriodo()}`,
                  bold: true,
                  margin: [0, 10, 0, 10],
                },
              ],
            },
            await this._getConciliaContabResumen(),
          ],
          footer: (page: string, pages: string) => {
            return this._pdfMakeSvc.getFooterDefinition(page, pages);
          },
          defaultStyle: {
            fontSize: 9,
          },
          styles: {
            tableHeader: {
              bold: true,
            },
          },
        };
      case 11: // Diferencias en la conciliación
        return {
          info: {
            title:
              'Diferencias en la Conciliación Externa por la Contabilidad | SISCO',
          },
          pageSize: 'LETTER',
          pageOrientation: 'landscape',
          content: [
            await this._pdfMakeSvc.getHeaderDefinition(reportName),
            await this._getDiferenciasConciliacion(),
          ],
          defaultStyle: {
            fontSize: 9,
          },
          styles: {
            tableHeader: {
              bold: true,
            },
          },
        };
      case 12: // Centros que no conciliaron
        return {
          info: {
            title:
              'Centro que no han realizado la Conciliación Externa por la Contabilidad | SISCO',
          },
          pageSize: 'LETTER',
          content: [
            await this._pdfMakeSvc.getHeaderDefinition(reportName),
            await this._centrosNoConciliados(),
          ],
          defaultStyle: {
            fontSize: 11,
          },
          styles: {
            tableHeader: {
              bold: true,
            },
          },
        };
    }
  }

  private async _getEmisorReceptorReporte() {
    return {
      margin: [0, 10, 0, 0],
      columns: [
        [
          {
            text: 'Centro a Analizar',
            bold: true,
            margin: [0, 0, 0, 5],
          },
          {
            text: `División: ${
              this.fg.get('division')?.value?.IdDivision
                ? this.fg.get('division')?.value?.IdDivision +
                  '-' +
                  this.fg.get('division')?.value?.Division
                : '--TODAS--'
            }`,
            margin: [0, 0, 0, 5],
          },
          {
            text: `Unidad:   ${
              this.fg.get('unidad')?.value?.Nombre || '--TODAS--'
            }`,
            margin: [0, 0, 0, 5],
          },
        ],
        [
          {
            text: 'Centro Emisor / Receptor',
            bold: true,
            margin: [0, 0, 0, 5],
          },
          {
            text: `División: ${
              this.fg.get('divisionOD')?.value?.IdDivision
                ? this.fg.get('divisionOD')?.value?.IdDivision +
                  '-' +
                  this.fg.get('divisionOD')?.value?.Division
                : '--TODAS--'
            }`,
            margin: [0, 0, 0, 5],
          },
          {
            text: `Unidad:   ${
              this.fg.get('unidadOD')?.value?.Nombre || '--TODAS--'
            }`,
            margin: [0, 0, 0, 5],
          },
        ],
      ],
    };
  }

  private async _getConciliaContab() {
    let totalEmisor = 0;
    let totalReceptor = 0;
    let totalDiferencia = 0;

    return {
      table: {
        headerRows: 1,
        widths: [
          'auto',
          'auto',
          'auto',
          50,
          'auto',
          'auto',
          'auto',
          'auto',
          'auto',
          50,
          'auto',
          'auto',
          'auto',
        ],
        body: [
          [
            {
              text: 'Tipo',
              style: 'tableHeader',
            },
            {
              text: 'Documento',
              style: 'tableHeader',
            },
            {
              text: 'Cuenta Emisor',
              style: 'tableHeader',
            },
            {
              text: 'Emisor',
              style: 'tableHeader',
            },
            {
              text: 'Fecha Emision',
              style: 'tableHeader',
            },
            {
              text: 'Importe Emisor',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: '|',
              style: 'tableHeader',
            },
            {
              text: 'Cuenta Receptor',
              style: 'tableHeader',
            },
            {
              text: 'División Receptor',
              style: 'tableHeader',
            },
            {
              text: 'Receptor',
              style: 'tableHeader',
            },
            {
              text: 'Fecha Recepción',
              style: 'tableHeader',
            },
            {
              text: 'Importe Receptor',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'Diferencia',
              style: 'tableHeader',
              alignment: 'right',
            },
          ],
          ...this.ConciliaContabRowData.map((item: IConciliaContab) => {
            totalEmisor += item.ValorEmisor;
            totalReceptor += item.ValorReceptor;
            totalDiferencia += item.DiferenciaImporte;

            return [
              item.Tipo,
              item.Documento,
              item.CuentaEmisor,
              item.Emisor,
              item.FechaEmision,
              {
                text: numberFormatter.format(item.ValorEmisor),
                alignment: 'right',
              },
              '|',
              item.CuentaReceptor,
              item.DivisionReceptor,
              item.Receptor,
              item.FechaRecepcion,
              {
                text: numberFormatter.format(item.ValorReceptor),
                alignment: 'right',
              },
              {
                text: numberFormatter.format(item.DiferenciaImporte),
                alignment: 'right',
              },
            ];
          }),
          [
            { text: 'TOTAL', bold: true, alignment: 'right' },
            {},
            {},
            {},
            {},
            {
              text: numberFormatter.format(totalEmisor),
              bold: true,
              alignment: 'right',
            },
            {},
            {},
            {},
            {},
            {},
            {
              text: numberFormatter.format(totalReceptor),
              bold: true,
              alignment: 'right',
            },
            {
              text: numberFormatter.format(totalDiferencia),
              bold: true,
              alignment: 'right',
            },
          ],
        ],
      },
    };
  }

  private async _getConciliaContabResumen() {
    let totalEmisor = 0;
    let totalReceptor = 0;
    let totalDiferencia = 0;

    return {
      table: {
        headerRows: 1,
        widths: [200, 90, 200, 90, 90],
        body: [
          [
            {
              text: 'División Emisor',
              style: 'tableHeader',
            },
            {
              text: 'Importe Emisor',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'División Receptor',
              style: 'tableHeader',
            },
            {
              text: 'Importe Receptor',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'Diferencia',
              style: 'tableHeader',
              alignment: 'right',
            },
          ],
          ...this.ConciliaContabResumenRowData.map(
            (item: IConciliaContabResumen) => {
              totalEmisor += item.ValorEmisor;
              totalReceptor += item.ValorReceptor;
              totalDiferencia += item.Diferencia;

              return [
                item.DivisionEmisor,
                {
                  text: numberFormatter.format(item.ValorEmisor),
                  alignment: 'right',
                },
                item.DivisionReceptor,
                {
                  text: numberFormatter.format(item.ValorReceptor),
                  alignment: 'right',
                },
                {
                  text: numberFormatter.format(item.Diferencia),
                  alignment: 'right',
                },
              ];
            }
          ),
          [
            { text: 'TOTAL', bold: true },
            {
              text: numberFormatter.format(totalEmisor),
              bold: true,
              alignment: 'right',
            },
            {},
            {
              text: numberFormatter.format(totalReceptor),
              bold: true,
              alignment: 'right',
            },
            {
              text: numberFormatter.format(totalDiferencia),
              bold: true,
              alignment: 'right',
            },
          ],
        ],
      },
    };
  }

  private async _getDiferenciasConciliacion() {
    return {
      table: {
        headerRows: 1,
        widths: [
          'auto',
          'auto',
          'auto',
          'auto',
          50,
          'auto',
          'auto',
          'auto',
          'auto',
          'auto',
          'auto',
          50,
          'auto',
          'auto',
          'auto',
          'auto',
        ],
        body: [
          [
            {
              text: 'Tipo',
              style: 'tableHeader',
            },
            {
              text: 'Cuenta',
              style: 'tableHeader',
            },
            {
              text: 'Emisor',
              style: 'tableHeader',
            },
            {
              text: 'Emitido A',
              style: 'tableHeader',
            },
            {
              text: 'Docum.',
              style: 'tableHeader',
            },
            {
              text: 'Fecha',
              style: 'tableHeader',
            },
            {
              text: 'Valor',
              style: 'tableHeader',
            },
            {
              text: '|',
              style: 'tableHeader',
            },
            {
              text: 'Cuenta',
              style: 'tableHeader',
            },
            {
              text: 'Receptor',
              style: 'tableHeader',
            },
            {
              text: 'Recibido De',
              style: 'tableHeader',
            },
            {
              text: 'Docum.',
              style: 'tableHeader',
            },
            {
              text: 'Fecha',
              style: 'tableHeader',
            },
            {
              text: 'Valor',
              style: 'tableHeader',
            },
            {
              text: 'Diferencia',
              style: 'tableHeader',
            },
            {
              text: 'Recibido',
              style: 'tableHeader',
            },
          ],
          ...this.DiferenciasConciliacionRowData.data.map((item: any) => {
            return [
              item.Tipo,
              item.CuentaE,
              item.Emisor,
              item.EmitidoA,
              item.DocumentoE,
              this.datePipe.transform(item.FechaE, 'dd-MM-yyyy'),
              Number(item.ValorE).toFixed(2),
              '|',
              item.CuentaR,
              item.Receptor,
              item.RecibidoDe,
              item.DocumentoR,
              this.datePipe.transform(item.FechaR, 'dd/MM/yyyy'),
              Number(item.ValorR).toFixed(2),
              Number(item.DiferenciaImporte).toFixed(2),
              item.Recibido ? 'Sí' : 'No',
            ];
          }),
        ],
      },
    };
  }

  private async _centrosNoConciliados() {
    return {
      table: {
        headerRows: 1,
        widths: [100, 100],
        body: [
          [
            {
              text: 'Emisor',
              style: 'tableHeader',
            },
            {
              text: 'Receptor',
              style: 'tableHeader',
            },
          ],
          ...this.CentrosNoConciliadosRowData.data.map((item: any) => {
            return [item.Emisor, item.Receptor];
          }),
        ],
      },
    };
  }
}
