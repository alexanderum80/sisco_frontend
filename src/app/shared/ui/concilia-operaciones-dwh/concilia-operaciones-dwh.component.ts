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
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._conciliarDWHSvc.fg.reset();
    this.fg = this._conciliarDWHSvc.fg;

    this._getDivisiones();
    this._subscribeToFgValueChanges();
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

              this.divisionesValues = result.map(d => {
                return {
                  value: d.IdDivision,
                  label: d.IdDivision + '-' + d.Division,
                };
              });
            },
            error: err => {
              this._swalSvc.error(err);
            },
          })
        );
      } else {
        this._conciliarDWHSvc.subscription.push(
          this._divisionesSvc.getDivisiones().subscribe({
            next: res => {
              const result = res.getAllDivisiones;

              this.divisionesValues = result.map(d => {
                return {
                  value: d.IdDivision,
                  label: d.IdDivision + '-' + d.Division,
                };
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
        ? this.fg.controls['idDivisionOD'].value
        : this.fg.controls['idDivision'].value;

      if (!idDivision) {
        return;
      }

      this._conciliarDWHSvc.subscription.push(
        this._subdivisionesSvc
          .getSubdivisionesByIdDivision(idDivision)
          .subscribe(res => {
            const result = res.getSubdivisionesByIdDivision;

            if (!result.success) {
              return this._swalSvc.error(result.error);
            }

            if (origenDestino) {
              this.subdivisionesODValues = result.data.map((d: any) => {
                return {
                  value: d.IdSubdivision,
                  label: d.IdSubdivision + '-' + d.Subdivision,
                };
              });
            } else {
              this.subdivisionesValues = result.data.map((d: any) => {
                return {
                  value: d.IdSubdivision,
                  label: d.IdSubdivision + '-' + d.Subdivision,
                };
              });
            }
          })
      );
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _getUnidades(origenDestino: boolean): void {
    try {
      const idSubdivision = origenDestino
        ? this.fg.controls['idSubdivisionOD'].value
        : this.fg.controls['idSubdivision'].value;
      if (!idSubdivision) {
        return;
      }

      this._conciliarDWHSvc.subscription.push(
        this._unidadesSvc
          .getUnidadesByIdSubdivision(idSubdivision)
          .subscribe(res => {
            const result = res.getUnidadesByIdSubdivision;

            if (!result.success) {
              return this._swalSvc.error(result.error);
            }

            if (origenDestino) {
              this.unidadesODValues = result.data.map((u: any) => {
                return {
                  value: u.IdUnidad,
                  label: u.Nombre,
                };
              });
            } else {
              this.unidadesValues = result.data.map((u: any) => {
                return {
                  value: u.IdUnidad,
                  label: u.Nombre,
                };
              });
            }
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
        this.fg.controls['idSubdivision'].setValue(null);

        this.subdivisionesValues = [];
        this._getSubdivisiones(false);

        this.dataSourceOriginal = [];
        this._updateDataSource();
      })
    );

    this._conciliarDWHSvc.subscription.push(
      this.fg.controls['idSubdivision'].valueChanges.subscribe(() => {
        this.fg.controls['idUnidad'].setValue(null);

        this.unidadesValues = [];
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
        this.fg.controls['idSubdivisionOD'].setValue(null);

        this.subdivisionesODValues = [];
        this._getSubdivisiones(true);

        this.dataSourceOriginal = [];
        this._updateDataSource();
      })
    );

    this._conciliarDWHSvc.subscription.push(
      this.fg.controls['idSubdivisionOD'].valueChanges.subscribe(() => {
        this.fg.controls['idUnidadOD'].setValue(null);

        this.unidadesODValues = [];
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
        IdDivision: this.fg.controls['idDivision'].value || 0,
        IdSubdivision: this.fg.controls['idSubdivision'].value || 0,
        IdUnidad: this.fg.controls['idUnidad'].value || 0,
        IdDivisionOD: this.fg.controls['idDivisionOD'].value || 0,
        IdSubdivisionOD: this.fg.controls['idSubdivisionOD'].value || 0,
        IdUnidadOD: this.fg.controls['idUnidadOD'].value || 0,
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
        pageSize: 'LETTER',
        // pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition(
            'Conciliación Interna Golden DWH'
          ),
          await this._conciliarDWHSvc.getDivision(
            this.fg.controls['idDivision'].value,
            this.divisionesValues
          ),
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
