import { PdfmakeService } from './../shared/services/pdfmake.service';
import { UnidadesService } from './../unidades/shared/services/unidades.service';
import { SweetalertService } from './../shared/services/sweetalert.service';
import { DivisionesService } from './../shared/services/divisiones.service';
import { ITableColumns } from 'src/app/shared/ui/prime-ng/table/table.model';
import { ConciliaInternaContaService } from './shared/services/concilia-interna-conta.service';
import { FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-concilia-interna-conta',
  templateUrl: './concilia-interna-conta.component.html',
  styleUrls: ['./concilia-interna-conta.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConciliaInternaContaComponent
  implements OnInit, AfterViewInit, OnDestroy, AfterContentChecked
{
  fg: FormGroup;

  dataSourceOriginal: any[] = [];
  dataSource: any[] = [];

  displayedColumns: ITableColumns[] = [
    { header: 'Cuenta', field: 'CuentaE', type: 'string' },
    { header: 'SubCuenta', field: 'SubCuentaE', type: 'string' },
    { header: 'Tipo', field: 'TipoE', type: 'string' },
    { header: 'Emisor', field: 'EmisorE', type: 'string' },
    { header: 'Receptor', field: 'ReceptorE', type: 'string' },
    { header: 'Valor', field: 'ValorE', type: 'decimal', totalize: true },
    { header: 'Operador', field: 'Operador', type: 'string' },
    { header: 'Cuenta', field: 'CuentaR', type: 'string' },
    { header: 'SubCuenta', field: 'SubCuentaR', type: 'string' },
    { header: 'Tipo', field: 'TipoR', type: 'string' },
    { header: 'Receptor', field: 'ReceptorR', type: 'string' },
    { header: 'Emisor', field: 'EmisorR', type: 'string' },
    { header: 'Valor', field: 'ValorR', type: 'decimal', totalize: true },
    {
      header: 'Diferencia',
      field: 'Diferencia',
      type: 'decimal',
      totalize: true,
    },
  ];

  divisionesValues: SelectItem[] = [];
  unidadesValues: SelectItem[] = [];
  tipoCentrosValues: SelectItem[] = [
    { value: '1', label: 'Todas/Todas' },
    { value: '2', label: 'Unidad/Todas' },
    { value: '3', label: 'Unidad/Unidad' },
  ];

  loading = false;

  constructor(
    private _conciliaInternaContaSvc: ConciliaInternaContaService,
    private _divisionesSvc: DivisionesService,
    private _unidadesSvc: UnidadesService,
    private _sweetAlertSvc: SweetalertService,
    private cd: ChangeDetectorRef,
    private _pdfMakeSvc: PdfmakeService
  ) {}

  ngOnInit(): void {
    this.fg = this._conciliaInternaContaSvc.fg;
    this.fg.reset();

    this.fg.controls['periodo'].patchValue(
      new Date(new Date().getFullYear(), new Date().getMonth(), 0)
    );

    this._subscribeToFgChanges();
  }

  ngAfterViewInit(): void {
    this._getDivisiones();
  }

  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this._conciliaInternaContaSvc.dispose();
  }

  private _getDivisiones(): void {
    try {
      this._conciliaInternaContaSvc.subscription.push(
        this._divisionesSvc.getDivisionesByUsuario().subscribe(response => {
          const result = response.getAllDivisionesByUsuario;

          if (!result.success) {
            return this._sweetAlertSvc.error(result.error);
          }

          this.divisionesValues = result.data.map(
            (d: { IdDivision: string; Division: string }) => {
              return {
                value: d.IdDivision,
                label: d.IdDivision + '-' + d.Division,
              };
            }
          );
        })
      );
    } catch (err: any) {
      this._sweetAlertSvc.error(err);
    }
  }

  private _subscribeToFgChanges(): void {
    this._conciliaInternaContaSvc.subscription.push(
      this.fg.controls['idDivision'].valueChanges.subscribe(value => {
        this.unidadesValues = [];
        this.dataSourceOriginal = [];
        this._updateDataSource();
        if (value) {
          this._unidadesSvc.getUnidadesByIdDivision(value).subscribe({
            next: res => {
              this.unidadesValues = res.getUnidadesByIdDivision.data.map(
                (u: { IdUnidad: string; Nombre: string }) => {
                  return {
                    value: u.IdUnidad,
                    label: u.Nombre,
                  };
                }
              );
            },
            error: err => {
              this._sweetAlertSvc.error(err);
            },
          });
        }
      })
    );

    this._conciliaInternaContaSvc.subscription.push(
      this.fg.controls['idUnidad'].valueChanges.subscribe(() => {
        this.dataSourceOriginal = [];
        this._updateDataSource();
      })
    );

    this._conciliaInternaContaSvc.subscription.push(
      this.fg.controls['idUnidadOD'].valueChanges.subscribe(() => {
        this.dataSourceOriginal = [];
        this._updateDataSource();
      })
    );

    this._conciliaInternaContaSvc.subscription.push(
      this.fg.controls['periodo'].valueChanges.subscribe(() => {
        this.dataSourceOriginal = [];
        this._updateDataSource();
      })
    );

    this._conciliaInternaContaSvc.subscription.push(
      this.fg.controls['tipoCentro'].valueChanges.subscribe(value => {
        switch (value) {
          case '1':
            this.fg.controls['idUnidad'].setValue(null);
            this.fg.controls['idUnidadOD'].setValue(null);
            break;
          case '2':
            this.fg.controls['idUnidadOD'].setValue(null);
            break;
        }
        this.dataSourceOriginal = [];
        this._updateDataSource();
      })
    );

    this._conciliaInternaContaSvc.subscription.push(
      this.fg.controls['soloDiferencias'].valueChanges.subscribe(() => {
        this._updateDataSource();
      })
    );
  }

  get showUnidadControl(): boolean {
    return this.fg.value.tipoCentro !== '1';
  }

  get showEmisorReceptorControl(): boolean {
    return this.fg.value.tipoCentro === '3';
  }

  private _updateDataSource(): void {
    if (this.fg.controls['soloDiferencias'].value === true)
      this.dataSource = cloneDeep(
        this.dataSourceOriginal.filter(d => d.Diferencia !== 0)
      );
    else this.dataSource = cloneDeep(this.dataSourceOriginal);
  }

  conciliar(): void {
    this.loading = true;
    this._conciliaInternaContaSvc.subscription.push(
      this._conciliaInternaContaSvc.conciliar().subscribe({
        next: res => {
          this.loading = false;
          this.dataSourceOriginal = res.conciliaInternaConta;
          this._updateDataSource();
        },
        error: err => {
          this.loading = false;
          this._sweetAlertSvc.error(err);
        },
      })
    );
  }

  async reporte(): Promise<any> {
    try {
      const documentDefinitions = {
        pageSize: 'LETTER',
        pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition(
            'Conciliación Interna Contabilidad'
          ),
          await this._conciliaInternaContaSvc.getDivision(
            this.fg.controls['idDivision'].value,
            this.divisionesValues
          ),
          await this._pdfMakeSvc.getPeriodoDefinition(
            +moment(this.fg.controls['periodo'].value).format('MM'),
            moment(this.fg.controls['periodo'].value).format('YYYY')
          ),
          await this._conciliaInternaContaSvc.getConciliacionDefinition(
            this.dataSource
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
      this._sweetAlertSvc.error(err);
    }
  }
}
