import { ToastrService } from 'ngx-toastr';
import { ActionClicked } from './../shared/models/list-items';
import { SweetalertService } from './../shared/helpers/sweetalert.service';
import { ClasificadorEntidadesService } from './../clasificador-entidades/shared/services/clasificador-entidades.service';
import { TipoEntidadesService } from './../tipo-entidades/shared/services/tipo-entidades.service';
import { PdfmakeService } from './../shared/helpers/pdfmake.service';
import { ConciliaContabilidadService } from './shared/services/concilia-contabilidad.service';
import { UnidadesService } from './../unidades/shared/services/unidades.service';
import { FormGroup } from '@angular/forms';
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit,
  ChangeDetectionStrategy,
  AfterContentChecked,
} from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { ITableColumns } from '../shared/ui/prime-ng/table/table.model';
import { TabView } from 'primeng/tabview';
import { cloneDeep, toNumber } from 'lodash';
import { SubdivisionesService } from '../shared/services/subdivisiones.service';
import { DivisionesService } from '../shared/services/divisiones.service';
import * as moment from 'moment';
import { IUnidades } from '../unidades/shared/models/unidades.model';
import { ISubdivisiones } from '../shared/models';
import {
  IChequeoCentroVsConsolidado,
  IConciliaCuadreSistemas,
  IConciliaInformacionContabilidad,
  IConciliaReporteClasificador,
  IConciliaReporteConsulta,
  IConciliaReporteExpresiones,
  IConciliaReporteValores,
} from './shared/models/concilia-contabilidad.model';

const DISPLAYED_COLUMNS_CONSULTAS: ITableColumns[] = [
  { header: 'Cuenta', field: 'Cuenta', type: 'string' },
  { header: 'SubCuenta', field: 'SubCuenta', type: 'string' },
  { header: 'Análisis 1', field: 'Analisis1', type: 'string' },
  { header: 'Análisis 2', field: 'Analisis2', type: 'string' },
  { header: 'Análisis 3', field: 'Analisis3', type: 'string' },
  { header: 'Análisis 4', field: 'Analisis4', type: 'string' },
  { header: 'Análisis 5', field: 'Analisis5', type: 'string' },
  { header: 'Total', field: 'Total', type: 'decimal' },
];

@Component({
  selector: 'app-concilia-contabilidad',
  templateUrl: './concilia-contabilidad.component.html',
  styleUrls: ['./concilia-contabilidad.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConciliaContabilidadComponent
  implements OnInit, AfterViewInit, OnDestroy, AfterContentChecked
{
  @ViewChild(TabView) tabView: TabView;

  centrosValues: SelectItem[] = [];
  tipoEntidadValues: SelectItem[] = [];

  displayedColumnsConciliacion = DISPLAYED_COLUMNS_CONSULTAS;
  displayedColumnsExpresiones: ITableColumns[] = [
    { header: 'Expresión', field: 'Expresion', type: 'string' },
    { header: 'Valor', field: 'Valor', type: 'decimal' },
    { header: 'Operador', field: 'Operador', type: 'string' },
    { header: 'Expresión', field: 'ExpresionC', type: 'string' },
    { header: 'Valor', field: 'ValorC', type: 'decimal' },
    { header: 'Resultado', field: 'Resultado', type: 'string' },
  ];
  displayedColumnsValores: ITableColumns[] = [
    { header: 'Expresión', field: 'Expresion', type: 'string' },
    { header: 'Valor', field: 'Valor', type: 'decimal' },
    { header: 'Operador', field: 'Operador', type: 'string' },
    { header: 'Valor Rodas', field: 'ValorRodas', type: 'decimal' },
    { header: 'Estado', field: 'Estado', type: 'string' },
  ];
  displayedColumnsCuadreSistemas: ITableColumns[] = [
    { header: 'Centro', field: 'Centro', type: 'string' },
    { header: 'Sistema', field: 'Sistema', type: 'string' },
    { header: 'Estado', field: 'Estado', type: 'string' },
  ];
  displayedColumnsClasificador: ITableColumns[] = [
    { header: 'Cuenta', field: 'Cuenta', type: 'string' },
    { header: 'SubCuenta', field: 'SubCuenta', type: 'string' },
    { header: 'Descripción', field: 'Descripcion', type: 'string' },
    { header: 'Crit1 Clasif', field: 'Crt1Clasif', type: 'string' },
    { header: 'Crit1 Rodas', field: 'Crt1Rodas', type: 'string' },
    { header: 'Crit2 Clasif', field: 'Crt2Clasif', type: 'string' },
    { header: 'Crit2 Rodas', field: 'Crt2Rodas', type: 'string' },
    { header: 'Crit3 Clasif', field: 'Crt3Clasif', type: 'string' },
    { header: 'Crit3 Rodas', field: 'Crt3Rodas', type: 'string' },
    { header: 'Nat Clasif', field: 'NatClasif', type: 'string' },
    { header: 'Nat Rodas', field: 'NatRodas', type: 'string' },
    { header: 'Obl Clasif', field: 'OblClasif', type: 'boolean' },
    { header: 'Obl Rodas', field: 'OblRodas', type: 'boolean' },
    { header: 'Term Clasf', field: 'TermClasf', type: 'boolean' },
    { header: 'Term Rodas', field: 'TermRodas', type: 'boolean' },
    {
      header: 'Crit1 Cons Clasif',
      field: 'Crit1ConsClasif',
      type: 'string',
    },
    { header: 'Crit1 Cons Rodas', field: 'Crit1ConsRodas', type: 'string' },
    {
      header: 'Crit2 Cons Clasif',
      field: 'Crit2ConsClasif',
      type: 'string',
    },
    { header: 'Crit2 Cons Rodas', field: 'Crit2ConsRodas', type: 'string' },
    {
      header: 'Crit3 Cons Clasif',
      field: 'Crit3ConsClasif',
      type: 'string',
    },
    { header: 'Crit3 Cons Rodas', field: 'Crit3ConsRodas', type: 'string' },
  ];
  displayedColumnsCentrosSubordinados: ITableColumns[] = [
    { header: 'Centro', field: 'Nombre', type: 'string' },
  ];
  displayedColumnsChequeo: ITableColumns[] = [
    { header: 'Cuenta', field: 'Cuenta', type: 'string' },
    { header: 'SubCuenta', field: 'SubCuenta', type: 'string' },
    { header: 'Análisis 1', field: 'Analisis1', type: 'string' },
    { header: 'Análisis 2', field: 'Analisis2', type: 'string' },
    { header: 'Análisis 3', field: 'Analisis3', type: 'string' },
    { header: 'Análisis 4', field: 'Analisis4', type: 'string' },
    { header: 'Análisis 5', field: 'Analisis5', type: 'string' },
    { header: 'Total', field: 'Total', type: 'decimal' },
  ];

  dataSourceAsientos: IConciliaReporteConsulta[] = [];
  dataSourceExpresiones: IConciliaReporteExpresiones[] = [];
  dataSourceValores: IConciliaReporteValores[] = [];
  dataSourceCuadreSistemas: IConciliaCuadreSistemas[] = [];
  dataSourceInformacion: IConciliaInformacionContabilidad[] = [];
  dataSourceClasificador: IConciliaReporteClasificador[] = [];
  dataSourceCentrosSubordinados: any[] = [];
  dataSourceChequeo: IChequeoCentroVsConsolidado[] = [];

  isConsolidado = false;
  loading = false;
  loadingCentros = true;
  chequeoCentro = false;

  centrosAChequear: any[] = [];

  selectedTabViewIndex = 0;

  tipoCentrosValues: SelectItem[] = [
    { value: '0', label: 'Centro' },
    { value: '1', label: 'Complejo' },
    { value: '2', label: 'Consolidado' },
  ];

  fg: FormGroup;

  myDatepicker: any;

  buttonConciliarItems: MenuItem[] = [
    {
      id: 'inicializar',
      label: 'Inicializar Datos',
      icon: 'mdi mdi-restart',
      command: () => {
        this._iniciarSaldos();
      },
    },
  ];

  constructor(
    private _unidadesSvc: UnidadesService,
    private _subdivisionesSvc: SubdivisionesService,
    private _divisionesSvc: DivisionesService,
    private _tipoEntidadesSvc: TipoEntidadesService,
    private _clasifEntidadesSvc: ClasificadorEntidadesService,
    private _conciliaContabSvc: ConciliaContabilidadService,
    private _pdfMakeSvc: PdfmakeService,
    private _swalSvc: SweetalertService,
    private _toastrSvc: ToastrService,
    private _cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fg = this._conciliaContabSvc.fg;
    this.fg.reset();

    this._subscribeToFgValueChanges();
  }

  ngAfterViewInit(): void {
    this._getUnidades();
    this._getTipoEntidades();
  }

  ngAfterContentChecked(): void {
    this._cd.detectChanges();
  }

  ngOnDestroy(): void {
    this._conciliaContabSvc.dispose();
  }

  private _subscribeToFgValueChanges(): void {
    this._conciliaContabSvc.subscription.push(
      this.fg.valueChanges.subscribe(() => {
        this._inicializarDatos();
      })
    );

    // TipoCentro
    this._conciliaContabSvc.subscription.push(
      this.fg.controls['tipoCentro'].valueChanges.subscribe(value => {
        this.isConsolidado = value === '2';
        if (this.isConsolidado) {
          this.fg.controls['tipoEntidad'].setValue(1);
          this._getCentrosSubordinados(
            toNumber(this.fg.get('idCentro')?.value)
          );
          this.buttonConciliarItems.unshift(
            {
              id: 'chequear',
              label: 'Chequear Centros',
              icon: 'mdi mdi-format-list-checks',
              command: () => {
                this._chequearCentros();
              },
            },
            { id: 'chequear', separator: true }
          );
        } else {
          const idUnidad = this.fg.get('idCentro')?.value;
          if (idUnidad) {
            this._updateTipoEntidad(idUnidad);
          } else {
            this.fg.controls['tipoEntidad'].setValue('');
          }
          this.buttonConciliarItems = this.buttonConciliarItems.filter(
            b => b.id !== 'chequear'
          );
        }
      })
    );

    // IdCentro
    this._conciliaContabSvc.subscription.push(
      this.fg.controls['idCentro'].valueChanges.subscribe(value => {
        if (this.fg.get('tipoCentro')?.value === '2') {
          this.fg.controls['tipoEntidad'].setValue(1);
          this._getCentrosSubordinados(toNumber(value));
        } else if (value) {
          this._updateTipoEntidad(value);
        } else {
          this.fg.controls['tipoEntidad'].setValue('');
        }
      })
    );

    // apertura
    this._conciliaContabSvc.subscription.push(
      this.fg.controls['apertura'].valueChanges.subscribe(value => {
        if (value) this.fg.controls['cierre'].setValue(false);
      })
    );

    // cierre
    this._conciliaContabSvc.subscription.push(
      this.fg.controls['cierre'].valueChanges.subscribe(value => {
        if (value) this.fg.controls['apertura'].setValue(false);
      })
    );
  }

  get isCierreOApertura(): boolean {
    return (
      this.fg.controls['apertura'].value || this.fg.controls['cierre'].value
    );
  }

  private _inicializarDatos(): void {
    this.dataSourceAsientos = [];
    this.dataSourceExpresiones = [];
    this.dataSourceValores = [];
    this.dataSourceCuadreSistemas = [];
    this.dataSourceClasificador = [];
    this.dataSourceCuadreSistemas = [];
    this.dataSourceChequeo = [];
  }

  private _getUnidades(): void {
    try {
      this._conciliaContabSvc.subscription.push(
        this._unidadesSvc.getAllUnidadesByUsuario().subscribe({
          next: res => {
            this.loadingCentros = false;

            const data = res.getAllUnidadesByUsuario;

            this.centrosValues = data.map((u: IUnidades) => {
              return {
                value: u.IdUnidad,
                label: u.Nombre,
              };
            });
          },
          error: err => {
            this.loadingCentros = false;
            this._swalSvc.error(err);
          },
        })
      );
    } catch (err: any) {
      this.loadingCentros = false;
      this._swalSvc.error(err);
    }
  }

  private _getCentrosSubordinados(subordinadoA: number): void {
    try {
      this.dataSourceCentrosSubordinados = [];

      switch (subordinadoA) {
        case 100:
          this._conciliaContabSvc.subscription.push(
            this._divisionesSvc.getDivisionesByUsuario().subscribe({
              next: res => {
                const result = res.getAllDivisionesByUsuario;

                this.dataSourceCentrosSubordinados = result.map(u => {
                  return {
                    IdCentro: u.IdDivision,
                    Nombre: u.IdDivision + '-' + u.Division,
                  };
                });

                this.dataSourceCentrosSubordinados.push({
                  IdCentro: '124',
                  Nombre: '124-DAOCC',
                });
                this.dataSourceCentrosSubordinados.push({
                  IdCentro: '655',
                  Nombre: '655-C.C COMPRAS DE LA CADENA',
                });

                this.dataSourceCentrosSubordinados =
                  this.dataSourceCentrosSubordinados.sort(
                    (a, b) => a.IdCentro - b.IdCentro
                  );
              },
              error: err => {
                this._swalSvc.error(err);
              },
            })
          );
          break;
        case 124:
          this._conciliaContabSvc.subscription.push(
            this._unidadesSvc
              .getUnidadesByIdSubdivision(subordinadoA)
              .subscribe({
                next: res => {
                  const data = res.getUnidadesByIdSubdivision;

                  this.dataSourceCentrosSubordinados = data.map(
                    (u: IUnidades) => {
                      return {
                        IdCentro: u.IdUnidad,
                        Nombre: u.Nombre,
                      };
                    }
                  );
                },
                error: err => {
                  this._swalSvc.error(err);
                },
              })
          );
          break;
        default:
          this._conciliaContabSvc.subscription.push(
            this._subdivisionesSvc
              .getSubdivisionesByIdDivision(subordinadoA)
              .subscribe({
                next: res => {
                  const data = res.getSubdivisionesByIdDivision;

                  this.dataSourceCentrosSubordinados = data.map(
                    (u: ISubdivisiones) => {
                      return {
                        IdCentro: u.IdSubdivision,
                        Nombre: u.IdSubdivision + '-' + u.Subdivision,
                      };
                    }
                  );
                },
                error: err => {
                  this._swalSvc.error(err);
                },
              })
          );
          break;
      }
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _getTipoEntidades(): void {
    try {
      this._conciliaContabSvc.subscription.push(
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
    this._conciliaContabSvc.subscription.push(
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

  updateSelectedCentrosChequeo(data: any): void {
    this.centrosAChequear = data;
  }

  conciliar(): void {
    try {
      this.loading = true;
      this.chequeoCentro = false;
      this._inicializarDatos();

      this._conciliaContabSvc.subscription.push(
        this._conciliaContabSvc.conciliar().subscribe({
          next: res => {
            this.loading = false;

            const result = res.conciliaContabilidad;

            this.dataSourceClasificador = [...result.ReporteClasificador];

            if (this.dataSourceClasificador.length)
              return this._swalSvc.error(
                'Usted tiene errores en el Clasificador, lo que conlleva a que no pueda terminar el análisis, ni entregar el balance a nivel superior. <br>Vaya a la pestaña Análisis del Clasificador y Corrija estos errores.'
              );

            this.dataSourceAsientos = [...result.ReporteConsultas];
            this.dataSourceExpresiones = [...result.ReporteExpresiones];
            this.dataSourceValores = [...result.ReporteValores];
            this.dataSourceCuadreSistemas = [...result.CuadreSistemas];
            this.dataSourceInformacion = [...result.Informacion];

            if (
              this.dataSourceCuadreSistemas.filter(
                (f: { Estado: string }) => f.Estado !== 'Correcto'
              ).length > 0
            ) {
              this._swalSvc.warning(
                'Existen incidencias en el Cuadre de los Sistemas. <br>Vaya a la pestaña Cuadre de los Sistemas para más información.'
              );
            }
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

  private _iniciarSaldos(): void {
    try {
      this._swalSvc
        .question('¿Desea Iniciar los Saldos del Centro seleccionado?')
        .then(res => {
          if (res === ActionClicked.Yes) {
            this.loading = true;
            this._inicializarDatos();

            this._conciliaContabSvc.subscription.push(
              this._conciliaContabSvc.iniciarSaldo().subscribe({
                next: () => {
                  this.loading = false;

                  this._toastrSvc.success(
                    'Saldos Iniciados Correctamente.',
                    'Satisfactorio'
                  );
                },
                error: err => {
                  this.loading = false;
                  this._swalSvc.error(err);
                },
              })
            );
          }
        });
    } catch (err: any) {
      this.loading = false;
      this._swalSvc.error(err);
    }
  }

  private _chequearCentros(): void {
    try {
      if (!this.centrosAChequear.length) {
        throw new Error('Debe seleccionar al menos 1 Centro a Chequear.');
      }

      this.selectedTabViewIndex = 0;
      this.loading = true;
      this.chequeoCentro = true;
      this._inicializarDatos();

      const idCentrosAChequear = this.centrosAChequear.map(row => {
        return row.IdCentro;
      });

      this._conciliaContabSvc.subscription.push(
        this._conciliaContabSvc.chequearCentros(idCentrosAChequear).subscribe({
          next: res => {
            this.loading = false;

            this.dataSourceChequeo = cloneDeep(res.chequearCentros);
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
      case 4:
        this._reporteDiferenciaClasificador();
        break;
      default:
        if (this.chequeoCentro) {
          this._reporteChequeo();
        } else {
          this._reporteConcilia();
        }
        break;
    }
  }

  private async _reporteConcilia(): Promise<any> {
    try {
      const documentDefinitions = {
        info: {
          title:
            'Reporte de incidencias en la entrega de los Estados Financieros | SISCO',
        },
        pageSize: 'LETTER',
        // pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition(
            'Reporte de incidencias de la entrega de los Estados Financieros'
          ),
          await this._pdfMakeSvc.getPeriodoDefinition(
            this.fg.get('apertura')?.value
              ? 0
              : this.fg.get('cierre')?.value
              ? 13
              : +moment(this.fg.controls['periodo'].value).format('MM'),
            moment(this.fg.controls['periodo'].value).format('YYYY')
          ),
          await this._conciliaContabSvc.getCentro(
            this.fg.get('idCentro')?.value,
            this.centrosValues
          ),
          await this._conciliaContabSvc.getTipoEntidad(
            this.fg.get('tipoEntidad')?.value,
            this.tipoEntidadValues
          ),
          await this._conciliaContabSvc.getReporteAsientoDefinition(
            this.dataSourceAsientos
          ),
          await this._conciliaContabSvc.getReporteExpresionesDefinition(
            this.dataSourceExpresiones
          ),
          await this._conciliaContabSvc.getReporteValoresDefinition(
            this.dataSourceValores
          ),
          await this._conciliaContabSvc.getReporteCuadreSistemasDefinition(
            this.dataSourceCuadreSistemas
          ),
          await this._conciliaContabSvc.getReporteInformacionDefinition(
            this.dataSourceInformacion
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

  private async _reporteChequeo(): Promise<any> {
    try {
      const documentDefinitions = {
        info: {
          title: 'Reporte de Chequeo de Centros vs Consolidado | SISCO',
        },
        pageSize: 'LETTER',
        // pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition(
            'Chequeo de Centros vs Consolidado'
          ),
          await this._pdfMakeSvc.getPeriodoDefinition(
            this.fg.get('apertura')?.value
              ? 0
              : this.fg.get('cierre')?.value
              ? 13
              : +moment(this.fg.controls['periodo'].value).format('MM'),
            moment(this.fg.controls['periodo'].value).format('YYYY')
          ),
          await this._conciliaContabSvc.getConsolidado(
            this.fg.get('idCentro')?.value,
            this.centrosValues
          ),
          await this._conciliaContabSvc.getReporteChequeoDefinition(
            this.dataSourceChequeo
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
        pageSize: 'LETTER',
        pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition(
            'Diferencias entre el Clasificador y el Clasificador del Rodas'
          ),
          await this._pdfMakeSvc.getPeriodoDefinition(
            this.fg.get('apertura')?.value
              ? 0
              : this.fg.get('cierre')?.value
              ? 13
              : +moment(this.fg.controls['periodo'].value).format('MM'),
            moment(this.fg.controls['periodo'].value).format('YYYY')
          ),
          await this._conciliaContabSvc.getCentro(
            this.fg.get('idCentro')?.value,
            this.centrosValues
          ),
          await this._conciliaContabSvc.getReporteDiferenciaClasificadorDefinition(
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
