import { IConciliaDWH } from './shared/models/concilia-dwh.model';
import { ITableColumns } from 'src/app/shared/ui/prime-ng/table/table.model';
import { ActionClicked } from './../shared/models/list-items';
import { SweetalertService } from './../shared/helpers/sweetalert.service';
import { SelectItem } from 'primeng/api';
import { SupervisoresService } from './../supervisores/shared/services/supervisores.service';
import { EmpleadosService } from './../empleados/shared/services/empleados.service';
import { UnidadesService } from './../unidades/shared/services/unidades.service';
import { DivisionesService } from './../shared/services/divisiones.service';
import { PdfmakeService } from './../shared/helpers/pdfmake.service';
import { toNumber } from 'lodash';
import { ConciliaGoldenDwhService } from './shared/services/concilia-golden-dwh.service';
import { FormGroup } from '@angular/forms';
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-concilia-golden-dwh',
  templateUrl: './concilia-golden-dwh.component.html',
  styleUrls: ['./concilia-golden-dwh.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConciliaGoldenDwhComponent
  implements OnInit, AfterViewInit, AfterContentChecked, OnDestroy
{
  displayedColumns: ITableColumns[] = [
    { header: 'Piso', field: 'Almacen', type: 'string' },
    { header: 'Cuenta', field: 'Cuenta', type: 'string' },
    {
      header: 'Saldo Restaurador',
      field: 'SaldoRestaurador',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Saldo Golden',
      field: 'SaldoGolden',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Dif. Rest. - Golden',
      field: 'DifGoldenRest',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Saldo Distribuidor',
      field: 'SaldoDistribuidor',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Dif. Rest. - Dist.',
      field: 'DifGoldenDist',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Saldo Rodas',
      field: 'SaldoRodas',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Dif. Rest. - Rodas',
      field: 'DifGoldenRodas',
      type: 'decimal',
      totalize: true,
    },
  ];

  displayedColumnsConsolidado: ITableColumns[] = [
    { header: 'Unidad', field: 'Unidad', type: 'string' },
    {
      header: 'Saldo Restaurador',
      field: 'SaldoRestaurador',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Saldo Golden',
      field: 'SaldoGolden',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Dif. Rest. - Golden',
      field: 'DifGoldenRest',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Saldo Distribuidor',
      field: 'SaldoDistribuidor',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Dif. Rest. - Dist.',
      field: 'DifGoldenDist',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Saldo Rodas',
      field: 'SaldoRodas',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Dif. Rest. - Rodas',
      field: 'DifGoldenRodas',
      type: 'decimal',
      totalize: true,
    },
  ];

  displayedColumnsAlmacenes: ITableColumns[] = [
    { header: 'Almacén', field: 'Almacen', type: 'string' },
    { header: 'Cuenta Golden', field: 'Cuenta', type: 'string' },
    { header: 'Cuenta Rodas', field: 'CuentaR', type: 'string' },
  ];

  divisionesValues: SelectItem[] = [];
  centrosValues: SelectItem[] = [];
  empleadosValues: SelectItem[] = [];
  supervisoresValues: SelectItem[] = [];

  rodasDWHInventarioVentas: IConciliaDWH[] = [];
  dataSourceInventario: IConciliaDWH[] = [];
  dataSourceVenta: IConciliaDWH[] = [];
  dataSourceAlmacenes: IConciliaDWH[] = [];

  isConsolidado = false;
  loading = false;

  selectedTabViewIndex = 0;

  unidadesList: any[] = [];

  tipoCentrosValues: SelectItem[] = [
    { value: '0', label: 'Centro' },
    { value: '1', label: 'Consolidado' },
  ];

  fg: FormGroup;

  myDatepicker: any;

  constructor(
    private _divisionesSvc: DivisionesService,
    private _unidadesSvc: UnidadesService,
    private _empleadosSvc: EmpleadosService,
    private _supervisoresSvc: SupervisoresService,
    private _conciliaDWHSvc: ConciliaGoldenDwhService,
    private _pdfMakeSvc: PdfmakeService,
    private _swalSvc: SweetalertService,
    private _changeDedectionRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fg = this._conciliaDWHSvc.fg;
    this.fg.reset();

    this._subscribeToFgValueChanges();
  }

  ngAfterViewInit(): void {
    this._getDivisiones();
    this._getEmpleados();
    this._getSupervisores();
  }

  ngAfterContentChecked(): void {
    this._changeDedectionRef.detectChanges();
  }

  ngOnDestroy(): void {
    this._conciliaDWHSvc.subscription.forEach(subsc => subsc.unsubscribe());
  }

  private _subscribeToFgValueChanges(): void {
    // cualquier cambio en el FG
    this._conciliaDWHSvc.subscription.push(
      this.fg.valueChanges.subscribe(() => {
        this._inicializarDatos();
      })
    );

    // TipoCentro
    this._conciliaDWHSvc.subscription.push(
      this.fg.controls['tipoCentro'].valueChanges.subscribe(value => {
        this.isConsolidado = value === '1';

        this._inicializarDatos();
      })
    );

    // IdDivision
    this._conciliaDWHSvc.subscription.push(
      this.fg.controls['idDivision'].valueChanges.subscribe(value => {
        this.fg.controls['idCentro'].setValue(null);

        this._getUnidades(value);
      })
    );
  }

  private _inicializarDatos(): void {
    this.rodasDWHInventarioVentas = [];
    this.dataSourceInventario = [];
    this.dataSourceVenta = [];
    this.dataSourceAlmacenes = [];
  }

  private _getDivisiones(): void {
    try {
      this._conciliaDWHSvc.subscription.push(
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
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _getUnidades(idDivision: number): void {
    try {
      if (!idDivision) {
        this.unidadesList = [];
        this.centrosValues = [];

        return;
      }

      this._conciliaDWHSvc.subscription.push(
        this._unidadesSvc.getUnidadesByIdDivision(idDivision).subscribe({
          next: res => {
            this.unidadesList = [...res.getUnidadesByIdDivision];

            this.centrosValues = this.unidadesList.map(d => {
              return {
                value: d.IdUnidad,
                label: d.Nombre,
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

  private _getEmpleados(): void {
    try {
      this._conciliaDWHSvc.subscription.push(
        this._empleadosSvc.loadAllEmpleados().subscribe(res => {
          const result = res.getAllEmpleados;

          if (!result.success) {
            return this._swalSvc.error(result.error);
          }

          this.empleadosValues = result.data.map(d => {
            return {
              value: d.IdEmpleado,
              label: d.Empleado,
            };
          });
        })
      );
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _getSupervisores(): void {
    try {
      this._conciliaDWHSvc.subscription.push(
        this._supervisoresSvc.loadAllSupervisores().subscribe(res => {
          const result = res.getAllSupervisores;

          if (!result.success) {
            return this._swalSvc.error(result.error);
          }

          this.supervisoresValues = result.data.map(d => {
            return {
              value: d.IdSupervisor,
              label: d.Supervisor,
            };
          });
        })
      );
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

  async conciliar(): Promise<void> {
    try {
      if (toNumber(this.fg.controls['tipoCentro'].value) === 1) {
        const dlg = await this._swalSvc.question(
          'Para obtener la información Consolidada, se debe haber terminado la Contabilidad del Consolidado del período.',
          '¿Desea continuar con la Conciliación del Consolidado?'
        );
        if (dlg === ActionClicked.No) {
          return;
        }
      }

      this.loading = true;

      this._inicializarDatos();

      this._conciliaDWHSvc.subscription.push(
        this._conciliaDWHSvc.conciliar().subscribe({
          next: res => {
            this.loading = false;

            this.rodasDWHInventarioVentas = res.conciliaDWH;

            this.dataSourceInventario = [
              ...this.rodasDWHInventarioVentas,
            ].filter(f => f.Tipo === 'Inventario');

            this.dataSourceVenta = [...this.rodasDWHInventarioVentas].filter(
              f => f.Tipo === 'Ventas'
            );

            this.dataSourceAlmacenes = [
              ...this.rodasDWHInventarioVentas,
            ].filter(f => f.Tipo === 'Almacenes');
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
        this.reporteAlmacenes();
        break;
      default:
        this.reporteConcilia();
        break;
    }
  }

  async reporteConcilia(): Promise<any> {
    try {
      const documentDefinitions = {
        info: {
          title: 'Conciliación Rodas vs Golden DWH | SISCO',
        },
        pageSize: 'LETTER',
        pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition(
            'Conciliación Rodas vs Golden DWH'
          ),
          await this._pdfMakeSvc.getPeriodoDefinition(
            +moment(this.fg.controls['periodo'].value).format('MM'),
            moment(this.fg.controls['periodo'].value).format('YYYY')
          ),
          await this._conciliaDWHSvc.getConciliacionDefinition(
            this.rodasDWHInventarioVentas,
            this.fg.controls['tipoCentro'].value,
            this.fg.controls['ventasAcumuladas'].value
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

  async reporteAlmacenes(): Promise<any> {
    try {
      const documentDefinitions = {
        pageSize: 'LETTER',
        // pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition(
            'Conciliación de Almacenes del Rodas Vs Golden DWH'
          ),
          await this._pdfMakeSvc.getPeriodoDefinition(
            +moment(this.fg.controls['periodo'].value).format('MM'),
            moment(this.fg.controls['periodo'].value).format('YYYY')
          ),
          await this._conciliaDWHSvc.getAlmacenesDefinition(
            this.dataSourceAlmacenes
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
