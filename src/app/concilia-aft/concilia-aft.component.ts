import { cloneDeep } from 'lodash';
import {
  IConciliaAFT,
  IDiferenciaClasificadorCNMB,
} from './shared/models/concilia-aft.model';
import { ConciliaAftService } from './shared/services/concilia-aft.service';
import { SweetalertService } from './../shared/helpers/sweetalert.service';
import { PdfmakeService } from './../shared/helpers/pdfmake.service';
import { ClasificadorEntidadesService } from './../clasificador-entidades/shared/services/clasificador-entidades.service';
import { TipoEntidadesService } from './../tipo-entidades/shared/services/tipo-entidades.service';
import { UnidadesService } from './../unidades/shared/services/unidades.service';
import { FormGroup } from '@angular/forms';
import { ITableColumns } from 'src/app/shared/ui/prime-ng/table/table.model';
import { SelectItem } from 'primeng/api';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  AfterContentChecked,
} from '@angular/core';
import * as moment from 'moment';
import { IUnidades } from '../unidades/shared/models/unidades.model';

@Component({
  selector: 'app-concilia-aft',
  templateUrl: './concilia-aft.component.html',
  styleUrls: ['./concilia-aft.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConciliaAftComponent
  implements OnInit, AfterViewInit, AfterContentChecked, OnDestroy
{
  displayedColumnsInventario: ITableColumns[] = [
    { header: 'Cuenta', field: 'Cta', type: 'string' },
    { header: 'SubCuenta', field: 'Scta', type: 'string' },
    { header: 'Análisis 1', field: 'An1', type: 'string' },
    { header: 'Análisis 2', field: 'An2', type: 'string' },
    { header: 'Análisis 3', field: 'An3', type: 'string' },
    {
      header: 'Saldo Inventario',
      field: 'Saldo_AF',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Saldo Rodas',
      field: 'Saldo_Rodas',
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

  displayedColumnsDepreciacion: ITableColumns[] = [
    { header: 'Cuenta', field: 'Cta', type: 'string' },
    { header: 'SubCuenta', field: 'Scta', type: 'string' },
    { header: 'Análisis 1', field: 'An1', type: 'string' },
    { header: 'Análisis 2', field: 'An2', type: 'string' },
    { header: 'Análisis 3', field: 'An3', type: 'string' },
    {
      header: 'Saldo Depreciación',
      field: 'Saldo_AF',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Saldo Rodas',
      field: 'Saldo_Rodas',
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

  displayedColumnsClasificador: ITableColumns[] = [
    { header: 'Unidad', field: 'Unidad', type: 'string' },
    { header: 'Grupo', field: 'Grupo', type: 'string' },
    { header: 'Código', field: 'Codigo', type: 'string' },
    { header: 'Descripción', field: 'Descripcion', type: 'string' },
    { header: 'Deprecia', field: 'Deprecia', type: 'boolean' },
    { header: 'Tasa Clasificador', field: 'Tasa', type: 'decimal' },
    { header: 'Tasa Unidad', field: 'TasaUC', type: 'decimal' },
  ];

  centrosValues: SelectItem[] = [];
  tipoEntidadValues: SelectItem[] = [];

  dataSourceConciliacion: IConciliaAFT[] = [];
  dataSourceInventario: IConciliaAFT[] = [];
  dataSourceDepreciacion: IConciliaAFT[] = [];
  dataSourceClasificador: IDiferenciaClasificadorCNMB[] = [];

  loading = false;
  selectedTabViewIndex = 0;

  tipoCentrosValues: SelectItem[] = [
    { value: '0', label: 'Centro' },
    { value: '2', label: 'Consolidado' },
  ];

  fg: FormGroup;

  myDatepicker: any;

  constructor(
    private _unidadesSvc: UnidadesService,
    private _tipoEntidadesSvc: TipoEntidadesService,
    private _clasifEntidadesSvc: ClasificadorEntidadesService,
    private _conciliaAftSvc: ConciliaAftService,
    private _pdfMakeSvc: PdfmakeService,
    private _swalSvc: SweetalertService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fg = this._conciliaAftSvc.fg;
    this.fg.reset();

    this._subscribeToFgValueChanges();
  }

  ngAfterViewInit(): void {
    this._getUnidades();
    this._getTipoEntidades();
  }

  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this._conciliaAftSvc.dispose();
  }

  private _subscribeToFgValueChanges(): void {
    try {
      this._conciliaAftSvc.subscription.push(
        this.fg.valueChanges.subscribe(() => {
          this._inicializarDatos();
        })
      );

      // IdCentro
      this._conciliaAftSvc.subscription.push(
        this.fg.controls['idCentro'].valueChanges.subscribe(value => {
          if (value) {
            this._updateTipoEntidad(value);
          } else {
            this.fg.controls['tipoEntidad'].setValue('');
          }
        })
      );
    } catch (error) {}
  }

  private _inicializarDatos(): void {
    this.dataSourceConciliacion = [];
    this.dataSourceInventario = [];
    this.dataSourceDepreciacion = [];
    this.dataSourceClasificador = [];
  }

  private _getUnidades(): void {
    try {
      this._conciliaAftSvc.subscription.push(
        this._unidadesSvc.getAllUnidadesByUsuario().subscribe({
          next: res => {
            const data = res.getAllUnidadesByUsuario;

            this.centrosValues = data.map((u: IUnidades) => {
              return {
                value: u.IdUnidad,
                label: u.Nombre,
              };
            });
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

  private _getTipoEntidades(): void {
    try {
      this._conciliaAftSvc.subscription.push(
        this._tipoEntidadesSvc.loadAllTipoEntidades().subscribe(res => {
          const result = res.getAllTipoEntidades;

          if (!result.success) {
            this._swalSvc.error(result.error);
            return;
          }

          this.tipoEntidadValues = result.data.map(
            (t: { Id: any; Entidades: any }) => {
              return {
                value: t.Id,
                label: t.Entidades,
              };
            }
          );
        })
      );
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _updateTipoEntidad(idUnidad: number): void {
    this._conciliaAftSvc.subscription.push(
      this._clasifEntidadesSvc.loadClasificadorEntidad(idUnidad).subscribe({
        next: res => {
          const result = res.getClasificadorEntidad;

          this.fg.controls['tipoEntidad'].setValue(result.IdTipoEntidad);
        },
        error: err => {
          this._swalSvc.error(err);
        },
      })
    );
  }

  conciliar(): void {
    try {
      this.loading = true;

      this._inicializarDatos();

      this._conciliaAftSvc.subscription.push(
        this._conciliaAftSvc.conciliar().subscribe({
          next: res => {
            this.loading = false;

            this.dataSourceClasificador =
              cloneDeep(res.conciliaAFT.DiferenciaClasificadorCNMB) || [];

            if (this.dataSourceClasificador.length) {
              return this._swalSvc.error(
                `Usted tiene errores en el clasificador, lo que conlleva a que no pueda terminar el análisis. Corrija estos errores.
                                Vaya a la pestaña Análisis del Clasificador para ver las diferencias.`
              );
            }

            this.dataSourceConciliacion = cloneDeep(
              res.conciliaAFT.ConciliaAFT || []
            );
            this.dataSourceInventario = this.dataSourceConciliacion
              ? cloneDeep(
                  this.dataSourceConciliacion.filter(
                    r => r.Tipo === 'Inventario'
                  )
                )
              : [];
            this.dataSourceDepreciacion = this.dataSourceConciliacion
              ? cloneDeep(
                  this.dataSourceConciliacion.filter(
                    r => r.Tipo === 'Depreciación'
                  )
                )
              : [];
          },
          error: err => {
            this.loading = false;

            this._swalSvc.error(err);
          },
        })
      );
    } catch (err: any) {
      this.loading = false;

      this._swalSvc.error(err);
    }
  }

  reporte(): void {
    switch (this.selectedTabViewIndex) {
      case 3:
        this._reporteDiferenciaClasificador();
        break;
      default:
        this._reporteConcilia();
        break;
    }
  }

  private async _reporteConcilia(): Promise<any> {
    try {
      const documentDefinitions = {
        info: {
          title: 'Conciliación Rodas vs AFT | SISCO',
        },
        pageSize: 'LETTER',
        // pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition(
            'Conciliación Rodas vs Activos Fijos'
          ),
          await this._pdfMakeSvc.getPeriodoDefinition(
            +moment(this.fg.controls['periodo'].value).format('MM'),
            moment(this.fg.controls['periodo'].value).format('YYYY')
          ),
          await this._conciliaAftSvc.getConciliacionDefinition(
            this.dataSourceConciliacion,
            this.fg.controls['tipoCentro'].value
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

  private async _reporteDiferenciaClasificador(): Promise<any> {
    try {
      const documentDefinitions = {
        info: {
          title: 'Diferencias en Clasificador de Subgrupos AFT | SISCO',
        },
        pageSize: 'LETTER',
        // pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition(
            'Diferencias en el Clasificador de Subgrupos'
          ),
          await this._pdfMakeSvc.getPeriodoDefinition(
            +moment(this.fg.controls['periodo'].value).format('MM'),
            moment(this.fg.controls['periodo'].value).format('YYYY')
          ),
          await this._conciliaAftSvc.getClasificadorDefinition(
            this.dataSourceClasificador
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

  handleTabViewChange(event: any): void {
    try {
      this.selectedTabViewIndex = event.index;
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }
}
