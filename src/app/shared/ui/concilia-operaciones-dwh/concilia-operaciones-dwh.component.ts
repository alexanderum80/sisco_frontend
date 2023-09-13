import { ConcilaOperacionesDwhService } from './concilia-operaciones-dwh.service';
import { ConciliaOperacionesDWHQueryResponse } from './concilia-operaciones-dwh.model';
import { SweetalertService } from './../../helpers/sweetalert.service';
import { PdfmakeService } from './../../helpers/pdfmake.service';
import { UnidadesService } from './../../../unidades/shared/services/unidades.service';
import { SubdivisionesService } from './../../services/subdivisiones.service';
import { DivisionesService } from './../../services/divisiones.service';
import { Apollo } from 'apollo-angular';
import { ITableColumns } from './../prime-ng/table/table.model';
import { SelectItem } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { cloneDeep } from 'lodash';
import { AuthenticationService } from '../../services/authentication.service';

const conciliaInternaDWHQuery = require('graphql-tag/loader!../../../concilia-interna-dwh/shared/graphql/concilia-interna-dwh.query.gql');
const conciliaExternaDWHQuery = require('graphql-tag/loader!../../../concilia-externa-dwh/shared/graphql/concilia-externa-dwh.query.gql');

@Component({
  selector: 'app-concilia-operaciones-dwh',
  templateUrl: './concilia-operaciones-dwh.component.html',
  styleUrls: ['./concilia-operaciones-dwh.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ConciliaOperacionesDwhComponent
  implements OnInit, AfterContentChecked, OnDestroy
{
  @Input() interna = false;

  fg: FormGroup;

  divisionesValues: SelectItem[] = [];
  subdivisionesValues: SelectItem[] = [];
  subdivisionesODValues: SelectItem[] = [];
  unidadesValues: SelectItem[] = [];
  unidadesODValues: SelectItem[] = [];

  displayedColumns: ITableColumns[] = [
    { header: 'Documento', field: 'Documento', type: 'string' },
    { header: 'Emisor', field: 'Emisor', type: 'string' },
    { header: 'Fecha Emisión', field: 'FechaE', type: 'string' },
    {
      header: 'Importe Emisor',
      field: 'ImporteE',
      type: 'decimal',
      totalize: true,
    },
    { header: 'Receptor', field: 'Receptor', type: 'string' },
    { header: 'Fecha Recepción', field: 'FechaR', type: 'string' },
    {
      header: 'Importe Receptor',
      field: 'ImporteR',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Diferencia',
      field: 'Diferencia',
      type: 'decimal',
      totalize: true,
    },
  ];

  dataSourceOriginal: any[] = [];
  dataSource: any[] = [];

  loading = false;

  constructor(
    private _apollo: Apollo,
    private _divisionesSvc: DivisionesService,
    private _subdivisionesSvc: SubdivisionesService,
    private _unidadesSvc: UnidadesService,
    private _conciliarDWHSvc: ConcilaOperacionesDwhService,
    private _pdfMakeSvc: PdfmakeService,
    private _swalSvc: SweetalertService,
    private cd: ChangeDetectorRef,
    private _authenticationSvc: AuthenticationService
  ) {}

  ngOnInit(): void {
    this._conciliarDWHSvc.fg.reset();
    this.fg = this._conciliarDWHSvc.fg;

    this._getDivisiones();
    this._subscribeToFgValueChanges();

    this.subdivisionesValues = [
      {
        value: '0',
        label: '--TODAS--',
      },
    ];
    this.subdivisionesODValues = [
      {
        value: '0',
        label: '--TODAS--',
      },
    ];

    this.unidadesValues = [
      {
        value: '0',
        label: '--TODAS--',
      },
    ];
    this.unidadesODValues = [
      {
        value: '0',
        label: '--TODAS--',
      },
    ];
  }

  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this._conciliarDWHSvc.dispose();
  }

  private _getDivisiones(): void {
    try {
      if (this.interna) {
        this._conciliarDWHSvc.subscription.push(
          this._divisionesSvc.getDivisionesByUsuario().subscribe({
            next: res => {
              const result = res.getAllDivisionesByUsuario;

              result.map(d => {
                this.divisionesValues.push({
                  value: d,
                  label: d.IdDivision + '-' + d.Division,
                });
              });

              this.fg.controls['idDivision'].setValue(null);
            },
            error: err => {
              this._swalSvc.error(err);
            },
          })
        );
      } else {
        if (
          this._authenticationSvc.hasSuperAdminPermission() ||
          this._authenticationSvc.hasFinancistaPermission()
        )
          this.divisionesValues = [
            {
              value: '0',
              label: '--TODAS--',
            },
          ];

        this._conciliarDWHSvc.subscription.push(
          this._divisionesSvc.getDivisiones().subscribe({
            next: res => {
              const result = res.getAllDivisiones;

              result.map(d => {
                this.divisionesValues.push({
                  value: d,
                  label: d.IdDivision + '-' + d.Division,
                });
              });
            },
            error: err => {
              this._swalSvc.error(err);
            },
          })
        );
      }
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _getSubdivisiones(origenDestino: boolean): void {
    try {
      const idDivision = origenDestino
        ? this.fg.get('idDivisionOD')?.value?.IdDivision || null
        : this.fg.get('idDivision')?.value?.IdDivision || null;

      if (!idDivision) {
        return;
      }

      this._conciliarDWHSvc.subscription.push(
        this._subdivisionesSvc
          .getSubdivisionesByIdDivision(idDivision)
          .subscribe({
            next: res => {
              const data = res.getSubdivisionesByIdDivision;

              if (origenDestino) {
                this.subdivisionesODValues = [
                  {
                    value: '0',
                    label: '--TODAS--',
                  },
                ];
                data.map((d: any) => {
                  this.subdivisionesODValues.push({
                    value: d,
                    label: d.IdSubdivision + '-' + d.Subdivision,
                  });
                });
              } else {
                this.subdivisionesValues = [
                  {
                    value: '0',
                    label: '--TODAS--',
                  },
                ];

                data.map((d: any) => {
                  this.subdivisionesValues.push({
                    value: d,
                    label: d.IdSubdivision + '-' + d.Subdivision,
                  });
                });
              }
            },
            error: err => {
              this._swalSvc.error(err);
            },
          })
      );
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _getUnidades(origenDestino: boolean): void {
    try {
      const idSubdivision = origenDestino
        ? this.fg.get('idSubdivisionOD')?.value?.IdSubdivision || null
        : this.fg.get('idSubdivision')?.value?.IdSubdivision || null;
      if (!idSubdivision) {
        return;
      }

      this._conciliarDWHSvc.subscription.push(
        this._unidadesSvc.getUnidadesByIdSubdivision(idSubdivision).subscribe({
          next: res => {
            const data = res.getUnidadesByIdSubdivision;

            if (origenDestino) {
              this.unidadesODValues = [
                {
                  value: '0',
                  label: '--TODAS--',
                },
              ];

              data.map((u: any) => {
                this.unidadesODValues.push({
                  value: u,
                  label: u.Nombre,
                });
              });
            } else {
              this.unidadesValues = [
                {
                  value: '0',
                  label: '--TODAS--',
                },
              ];

              data.map((u: any) => {
                this.unidadesValues.push({
                  value: u,
                  label: u.Nombre,
                });
              });
            }
          },
          error: err => {
            return this._swalSvc.error(err);
          },
        })
      );
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _subscribeToFgValueChanges(): void {
    // Centro a analizar
    this._conciliarDWHSvc.subscription.push(
      this.fg.controls['idDivision'].valueChanges.subscribe(value => {
        if (this.interna) this.fg.controls['idDivisionOD'].setValue(value);
        this.fg.controls['idSubdivision'].setValue('0');

        this._getSubdivisiones(false);

        this.dataSourceOriginal = [];
        this._updateDataSource();
      })
    );

    this._conciliarDWHSvc.subscription.push(
      this.fg.controls['idSubdivision'].valueChanges.subscribe(() => {
        this.fg.controls['idUnidad'].setValue('0');

        this._getUnidades(false);

        this.dataSourceOriginal = [];
        this._updateDataSource();
      })
    );

    this._conciliarDWHSvc.subscription.push(
      this.fg.controls['idUnidad'].valueChanges.subscribe(() => {
        this.dataSourceOriginal = [];
        this._updateDataSource();
      })
    );

    // Centro Origen/Destino
    this._conciliarDWHSvc.subscription.push(
      this.fg.controls['idDivisionOD'].valueChanges.subscribe(() => {
        this.fg.controls['idSubdivisionOD'].setValue('0');

        this._getSubdivisiones(true);

        this.dataSourceOriginal = [];
        this._updateDataSource();
      })
    );

    this._conciliarDWHSvc.subscription.push(
      this.fg.controls['idSubdivisionOD'].valueChanges.subscribe(() => {
        this.fg.controls['idUnidadOD'].setValue('0');

        this._getUnidades(true);

        this.dataSourceOriginal = [];
        this._updateDataSource();
      })
    );

    this._conciliarDWHSvc.subscription.push(
      this.fg.controls['idUnidadOD'].valueChanges.subscribe(() => {
        this.dataSourceOriginal = [];
        this._updateDataSource();
      })
    );

    // Fechas
    this._conciliarDWHSvc.subscription.push(
      this.fg.controls['fechaInicial'].valueChanges.subscribe(() => {
        this.dataSourceOriginal = [];
        this._updateDataSource();
      })
    );

    this._conciliarDWHSvc.subscription.push(
      this.fg.controls['fechaFinal'].valueChanges.subscribe(() => {
        this.dataSourceOriginal = [];
        this._updateDataSource();
      })
    );

    // Solo Diferencias
    this._conciliarDWHSvc.subscription.push(
      this.fg.controls['soloDiferencias'].valueChanges.subscribe(() => {
        this._updateDataSource();
      })
    );
  }

  private _updateDataSource(): void {
    if (this.fg.controls['soloDiferencias'].value === true)
      this.dataSource = cloneDeep(
        this.dataSourceOriginal.filter(d => d.Diferencia !== 0)
      );
    else this.dataSource = cloneDeep(this.dataSourceOriginal);
  }

  conciliar(): void {
    try {
      this.loading = true;

      const payload = {
        FechaInicial: this.fg.controls['fechaInicial'].value,
        FechaFinal: this.fg.controls['fechaFinal'].value,
        IdDivision: this.fg.controls['idDivision'].value.IdDivision || 0,
        IdSubdivision:
          this.fg.controls['idSubdivision'].value.IdSubdivision || 0,
        IdUnidad: this.fg.controls['idUnidad'].value.IdUnidad || 0,
        IdDivisionOD: this.fg.controls['idDivisionOD'].value.IdDivision || 0,
        IdSubdivisionOD:
          this.fg.controls['idSubdivisionOD'].value.IdSubdivision || 0,
        IdUnidadOD: this.fg.controls['idUnidadOD'].value.IdUnidad || 0,
      };

      const _query = this.interna
        ? conciliaInternaDWHQuery
        : conciliaExternaDWHQuery;

      const _variable = this.interna
        ? {
            conciliaInternaDWHInput: payload,
          }
        : {
            conciliaExternaDWHInput: payload,
          };

      this._conciliarDWHSvc.subscription.push(
        this._apollo
          .query<ConciliaOperacionesDWHQueryResponse>({
            query: _query,
            variables: _variable,
            fetchPolicy: 'network-only',
          })
          .subscribe(res => {
            this.loading = false;
            const result = this.interna
              ? res.data.conciliaInternaDWH
              : res.data.conciliaExternaDWH;

            if (!result.success) {
              return this._swalSvc.error(result.error);
            }

            this.dataSourceOriginal = result.data;
            this._updateDataSource();
          })
      );
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  async reporte(): Promise<any> {
    try {
      const fechaInicial = this.fg.controls['fechaInicial'].value;
      const fechaFinal = this.fg.controls['fechaFinal'].value;

      const documentDefinitions = {
        info: {
          title: `Conciliación ${
            this.interna ? 'Interna' : 'Externa'
          } Golden DWH | SISCO`,
        },
        pageSize: 'LETTER',
        // pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition(
            `Conciliación ${this.interna ? 'Interna' : 'Externa'} Golden DWH`
          ),
          await this._conciliarDWHSvc.getEmisorReceptorReporte(),
          await this._conciliarDWHSvc.getConciliacionDefinition(
            this.dataSource,
            fechaInicial,
            fechaFinal
          ),
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

      this._pdfMakeSvc.generatePdf(documentDefinitions);
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }
}
