import { AuthenticationService } from './../shared/services/authentication.service';
import { ITableColumns } from 'src/app/shared/ui/prime-ng/table/table.model';
import { PdfmakeService } from './../shared/services/pdfmake.service';
import { orderBy, round } from 'lodash';
import { ActionClicked } from './../shared/models/list-items';
import { UnidadesService } from './../unidades/shared/services/unidades.service';
import { DivisionesService } from './../shared/services/divisiones.service';
import { SweetalertService } from './../shared/services/sweetalert.service';
import { ExcelService } from './shared/service/excel.service';
import { ConciliaExternaContaService } from './shared/service/concilia-externa.service';
import { ConciliaMenuOptions } from './shared/models/concilia-externa.model';
import { SocketService } from './../shared/services/socket.service';
import { SelectItem, MenuItem } from 'primeng/api';
import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-concilia-externa-conta',
  templateUrl: './concilia-externa-conta.component.html',
  styleUrls: ['./concilia-externa-conta.component.scss'],
})
export class ConciliaExternaContaComponent
  implements OnInit, AfterViewInit, AfterContentChecked
{
  private _conciliacionStatus = '';
  divisionesValues: SelectItem[] = [];
  divisionesODValues: SelectItem[] = [];
  unidadesValues: SelectItem[] = [
    {
      value: '0',
      label: '--TODAS--',
    },
  ];
  unidadesODValues: SelectItem[] = [
    {
      value: '0',
      label: '--TODAS--',
    },
  ];

  conciliaContabData: any[] = [];
  actaConciliaEmisorData: any[] = [];
  actaConciliaReceptorData: any[] = [];

  displayedColumns: ITableColumns[] = [
    { header: 'Tipo', field: 'Tipo', type: 'string' },
    { header: 'Documento', field: 'Documento', type: 'string' },
    { header: 'Cuenta Emisor', field: 'CuentaEmisor', type: 'string' },
    { header: 'Emisor', field: 'Emisor', type: 'string' },
    { header: 'Fecha Emisión', field: 'FechaEmision', type: 'string' },
    {
      header: 'Importe Emisor',
      field: 'ValorEmisor',
      type: 'decimal',
      totalize: true,
    },
    { header: 'Cuenta Receptor', field: 'CuentaReceptor', type: 'string' },
    { header: 'División Receptor', field: 'DivisionReceptor', type: 'string' },
    { header: 'Receptor', field: 'Receptor', type: 'string' },
    { header: 'Fecha Recepción', field: 'FechaRecepcion', type: 'string' },
    {
      header: 'Importe Receptor',
      field: 'ValorReceptor',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Diferencia',
      field: 'DiferenciaImporte',
      type: 'decimal',
      totalize: true,
    },
  ];

  actaDisplayedColumns: ITableColumns[] = [
    { header: 'Detalle', field: 'Detalle', type: 'string', width: '250px' },
    {
      header: 'Saldo Emisor',
      field: 'SaldoEmisor',
      type: 'decimal',
      totalize: true,
    },
    {
      header: 'Saldo Receptor',
      field: 'SaldoEmisor',
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

  conciliarButtonItems: MenuItem[] = [
    {
      id: ConciliaMenuOptions.IniciarConciliacion,
      label: 'Iniciar Conciliación',
      icon: 'mdi mdi-folder-lock-open',
      disabled: false,
      visible: true,
      command: () => {
        this._iniciarConciliacion();
      },
    },
    {
      id: ConciliaMenuOptions.CerrarConciliacion,
      label: 'Cerrar Conciliación',
      icon: 'mdi mdi-folder-lock',
      disabled: false,
      visible: true,
      command: () => {
        this._swalSvc
          .question(
            `Si cierra la Conciliación, ningún otro centro podrá Conciliar.
            <br>¿Desea Cerrar la conciliación del período actual?`
          )
          .then(res => {
            if (res === ActionClicked.Yes) {
              this._cerrarConciliacion();
            }
          });
      },
    },
    {
      id: ConciliaMenuOptions.ReabrirConciliacion,
      label: 'Reabrir Conciliación',
      icon: 'mdi mdi-folder-key-outline',
      disabled: false,
      visible: true,
      command: () => {
        this._swalSvc
          .question(
            `¿Está seguro que desea reabrir la conciliación del período actual?`
          )
          .then(res => {
            if (res === ActionClicked.Yes) {
              this._reabrirConciliacion();
            }
          });
      },
    },
  ];

  reportesButtonItems: MenuItem[] = [
    {
      id: ConciliaMenuOptions.DiferenciasConciliacion,
      label: 'Diferencias en Conciliación',
      icon: 'mdi mdi-file-document-edit-outline',
      disabled: false,
      visible: true,
      command: () => {
        this._diferenciasEnConciliacion();
      },
    },
    {
      id: ConciliaMenuOptions.CentroNoConciliados,
      label: 'Centros no Conciliados',
      icon: 'mdi mdi-file-document-box-remove-outline',
      disabled: false,
      visible: true,
      command: () => {
        this._centrosNoConciliados();
      },
    },
  ];

  selectedTab = 0;
  reporteName = 'Conciliación Externa en Rodas.';

  loadingDivisiones = false;
  loadingUnidades = false;
  loadingUsuarios = false;
  loadingConcNacVsAsiento = false;
  loadingConciliacion = false;
  loadingConciliacionEntreUnidadesEmisor = false;
  loadingConciliacionEntreUnidadesReceptor = false;
  loadingDiferenciasConciliacion = false;
  loadingCentrosNoConciliados = false;

  saving = false;

  isEditing = false;

  fg: FormGroup;

  showReport = false;

  chatToggle = true;

  constructor(
    private _authSvc: AuthenticationService,
    public _conciliaExternaContaSvc: ConciliaExternaContaService,
    private _socketService: SocketService,
    private _excelService: ExcelService,
    private _swalSvc: SweetalertService,
    private _divisionesSvc: DivisionesService,
    private _unidadesSvc: UnidadesService,
    private _pdfMakeSvc: PdfmakeService,
    private _cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fg = this._conciliaExternaContaSvc.fg;

    if (!this._authSvc.hasAdvancedUserPermission()) {
      this.fg.get('division')?.disable();
    }

    this._subscribeToFgChange();

    this.fg.controls['division'].setValue(
      this._authSvc.usuario.IdDivision.toString()
    );

    this._loadDivisiones();
    // this._loadUsuarios();
  }

  ngAfterViewInit() {
    this._loadDatosConciliacion();
    this._subscribeToConciliacionStatusChange();
  }

  ngAfterContentChecked(): void {
    this._cd.detectChanges();
  }

  private _subscribeToConciliacionStatusChange() {
    this._socketService.conciliaStatus$.subscribe(() => {
      this._loadDatosConciliacion();
    });
  }

  set conciliacionStatus(status) {
    this._conciliacionStatus = status;
  }

  get conciliacionStatus() {
    return this._conciliacionStatus;
  }

  get conciliacionStatusAbierta() {
    return this._conciliacionStatus === 'ABIERTA';
  }

  hasAdminPermission() {
    return this._authSvc.hasAdminPermission();
  }

  hasUsuarioAvanzadoPermission() {
    return this._authSvc.hasAdvancedUserPermission();
  }

  private _loadDatosConciliacion() {
    this._conciliaExternaContaSvc.getDatosConciliacion().subscribe({
      next: res => {
        this._updateConciliaStatus(res.getDatosConciliacionExterna.Abierta);
      },
      error: () => {
        this.conciliacionStatus = 'NO INICIADA';
        this._updateMenuOptions(ConciliaMenuOptions.IniciarConciliacion);
      },
    });
  }

  private _updateConciliaStatus(abierta: boolean) {
    switch (abierta) {
      case true:
        this.conciliacionStatus = 'ABIERTA';
        this._updateMenuOptions(ConciliaMenuOptions.CerrarConciliacion);
        break;
      case false:
        this.conciliacionStatus = 'CERRADA';
        this._updateMenuOptions(ConciliaMenuOptions.ReabrirConciliacion);
        break;
    }
  }

  private _updateMenuOptions(menuOption: string) {
    this.conciliarButtonItems.map(menu => {
      menu.visible =
        menu.id === menuOption && this._authSvc.usuario.IdTipoUsuario === 1;
    });

    this.reportesButtonItems.map(menu => {
      if (
        menu.id === ConciliaMenuOptions.DiferenciasConciliacion ||
        menu.id === ConciliaMenuOptions.CentroNoConciliados
      ) {
        menu.visible =
          menuOption === ConciliaMenuOptions.ReabrirConciliacion &&
          this._authSvc.usuario.TipoUsuario === 1;
      }
    });
  }

  private _loadDivisiones() {
    this._divisionesSvc.getDivisiones().subscribe({
      next: responseD => {
        this.loadingDivisiones = false;
        const result = responseD.getAllDivisiones;

        if (!result.success) {
          return this._swalSvc.error(result.error);
        }

        this.divisionesValues = result.data.map((d: any) => {
          return {
            value: d.IdDivision.toString(),
            label: d.IdDivision.toString() + '-' + d.Division,
          };
        });
        this.divisionesValues.unshift({
          value: '0',
          label: '--TODAS--',
        });

        this.divisionesODValues = result.data.map((d: any) => {
          return {
            value: d.IdDivision.toString(),
            label: d.IdDivision.toString() + '-' + d.Division,
          };
        });
        this.divisionesODValues.unshift({
          value: '0',
          label: '--TODAS--',
        });
      },
      error: err => {
        this._swalSvc.error(err.message || err);
      },
    });
  }

  private _loadUnidades(origenDestino: boolean) {
    const idDivision = origenDestino
      ? +this.fg.controls['divisionOD'].value
      : +this.fg.controls['division'].value;

    if (!idDivision) {
      return;
    }

    this._unidadesSvc.getUnidadesByIdDivision(idDivision).subscribe({
      next: responseD => {
        this.loadingUnidades = false;
        const result = responseD.getUnidadesByIdDivision;

        if (!result.success) {
          return this._swalSvc.error(result.error);
        }

        if (origenDestino) {
          this.unidadesODValues = result.data.map((u: any) => {
            return {
              value: u.IdUnidad,
              label: u.IdUnidad + '-' + u.Nombre,
            };
          });
          this.unidadesODValues.unshift({
            value: '0',
            label: '--TODAS--',
          });
        } else {
          this.unidadesValues = result.data.map((u: any) => {
            return {
              value: u.IdUnidad,
              label: u.IdUnidad + '-' + u.Nombre,
            };
          });
          this.unidadesValues.unshift({
            value: '0',
            label: '--TODAS--',
          });
        }
      },
      error: err => {
        this._swalSvc.error(err.message || err);
      },
    });
  }

  private _subscribeToFgChange() {
    this.fg.valueChanges.subscribe(() => {
      this._inicializarDatos();
    });

    this.fg.controls['division'].valueChanges.subscribe(() => {
      this.fg.controls['unidad'].setValue('0');
      this._loadUnidades(false);
    });
    this.fg.controls['divisionOD'].valueChanges.subscribe(() => {
      this.fg.controls['unidadOD'].setValue('0');
      this._loadUnidades(true);
    });

    this.fg.controls['periodo'].valueChanges.subscribe(() => {
      this._loadDatosConciliacion();
    });
  }

  private _inicializarDatos() {
    this._conciliaExternaContaSvc.RecDifCantidadRowData = [];
    this.conciliaContabData = [];
    this._conciliaExternaContaSvc.ConciliaContabRowData = [];
    this.actaConciliaEmisorData = [];
    this._conciliaExternaContaSvc.ActaConciliacionEmisorRowData = [];
    this.actaConciliaReceptorData = [];
    this._conciliaExternaContaSvc.ActaConciliacionReceptorRowData = [];
  }

  private _iniciarConciliacion() {
    this._conciliaExternaContaSvc.iniciarConciliacion().subscribe({
      next: response => {
        const result = response.inicializarConciliacion;
        if (!result.success) {
          return this._swalSvc.error(result.error);
        }
        this._socketService.emitSocket('concilia-status-change', true);

        this._swalSvc.info('Se ha iniciado la Conciliación correctamente.');
      },
      error: err => {
        this._swalSvc.error(err.message || err);
      },
    });
  }

  private _cerrarConciliacion() {
    this._conciliaExternaContaSvc.iniciarConciliacion().subscribe({
      next: response => {
        const result = response.cerrarConciliacion;
        if (!result.success) {
          return this._swalSvc.error(result.error);
        }
        this._socketService.emitSocket('concilia-status-change', false);

        this._swalSvc.info('Se ha cerrado la Conciliación correctamente.');
      },
      error: err => {
        this._swalSvc.error(err.message || err);
      },
    });
  }

  private _reabrirConciliacion() {
    this._conciliaExternaContaSvc.reabrirConciliacion().subscribe({
      next: () => {
        this._socketService.emitSocket('concilia-status-change', true);

        this._swalSvc.info('Se ha reabierto la Conciliación correctamente.');
      },
      error: err => {
        this._swalSvc.error(err.message || err);
      },
    });
  }

  private _diferenciasEnConciliacion() {
    this.loadingDiferenciasConciliacion = true;

    this._conciliaExternaContaSvc.diferenciasConciliacion().subscribe({
      next: response => {
        this.loadingDiferenciasConciliacion = false;

        const result = response.getDiferenciasEnConciliacion;
        if (!result.success) {
          return this._swalSvc.error(result.error);
        }

        this._conciliaExternaContaSvc.DiferenciasConciliacionRowData =
          result.data;
        this.reporteName = 'Documentos con Diferencias en la Conciliación';
        this.selectedTab = 10;

        this.generatePDF();
      },
      error: err => {
        this._swalSvc.error(err.message || err);
      },
    });
  }

  private _centrosNoConciliados() {
    try {
      this.loadingCentrosNoConciliados = true;

      this._conciliaExternaContaSvc.diferenciasConciliacion().subscribe({
        next: response => {
          this.loadingCentrosNoConciliados = false;

          const result = response.getDiferenciasEnConciliacion;
          if (!result.success) {
            return this._swalSvc.error(result.error);
          }

          let data = result.data;
          data = orderBy(data, ['Emisor', 'Receptor']);

          this._conciliaExternaContaSvc.CentrosNoConciliadosRowData = data;
          this.reporteName = 'Centros que no realizaron la Conciliación';
          this.selectedTab = 11;

          this.generatePDF();
        },
        error: err => {
          this._swalSvc.error(err.message || err);
        },
      });
    } catch (err: any) {
      this._swalSvc.error(err.message || err);
    }
  }

  get isFormValid() {
    return this.fg ? this.fg.valid : false;
  }

  salvar() {
    switch (this.selectedTab) {
      case 2:
        this._salvaConciliaContabilidad();
        break;
    }
  }

  get loading() {
    return (
      this.loadingConcNacVsAsiento ||
      this.loadingDivisiones ||
      this.loadingUsuarios ||
      this.loadingUnidades ||
      this.loadingConciliacion ||
      this.loadingConciliacionEntreUnidadesEmisor ||
      this.loadingConciliacionEntreUnidadesReceptor ||
      this.loadingDiferenciasConciliacion ||
      this.loadingCentrosNoConciliados
    );
  }

  conciliar() {
    try {
      this.loadingConciliacion = true;

      this._conciliaExternaContaSvc.calculaConciliacion().subscribe({
        next: response => {
          this.loadingConciliacion = false;

          this.conciliaContabData = [
            ...response.getConciliacionExternaContab.getConciliaContab,
          ];
          this._conciliaExternaContaSvc.ConciliaContabRowData = [
            ...this.conciliaContabData,
          ];

          const datosActa = [
            ...response.getConciliacionExternaContab.getActaConciliacion,
          ];
          const actaEmisor = datosActa.filter(
            (f: any) =>
              f.Emisor.toString() ===
                this.fg.controls['unidad'].value.toString() &&
              f.Receptor.toString() ===
                this.fg.controls['unidadOD'].value.toString()
          );
          const actaReceptor = datosActa.filter(
            (f: any) =>
              f.Receptor.toString() ===
                this.fg.controls['unidad'].value.toString() &&
              f.Emisor.toString() ===
                this.fg.controls['unidadOD'].value.toString()
          );

          this.actaConciliaEmisorData = [...actaEmisor];
          this._conciliaExternaContaSvc.ActaConciliacionEmisorRowData = [
            ...actaEmisor,
          ];

          this.actaConciliaReceptorData = [...actaReceptor];
          this._conciliaExternaContaSvc.ActaConciliacionReceptorRowData = [
            ...actaReceptor,
          ];
        },
        error: err => {
          this.loadingConciliacion = false;
          this._swalSvc.error(err.message || err);
        },
      });
    } catch (err: any) {
      this.loadingConciliacion = false;
      this._swalSvc.error(err.message || err);
    }
  }

  changeTab(tab: number) {
    this.selectedTab = tab;

    switch (this.selectedTab) {
      case 0:
        this.reporteName = 'Conciliación Nacional en Rodas.';
        break;
      case 1:
        this.reporteName = 'Acta de Conciliación Cuentas por Cobrar y Pagar';
        break;
    }
  }

  async openReporte() {
    if (this.selectedTab === 3) {
      this._conciliacionEntreUnidadesEmisor();
      this._conciliacionEntreUnidadesReceptor();
      // this.updateActaConciliacionUsuariosList();

      this.showReport = true;
    } else {
      this.generatePDF();
    }
  }

  private _conciliacionEntreUnidadesEmisor() {
    try {
      this.loadingConciliacionEntreUnidadesEmisor = true;

      this._conciliaExternaContaSvc
        .conciliacionEntreUnidadesEmisor()
        .subscribe({
          next: response => {
            this.loadingConciliacionEntreUnidadesEmisor = false;

            const result = response.getConciliacionEntreUnidades;
            if (!result.success) {
              return this._swalSvc.error(result.error);
            }

            const data = result.data;
            this._conciliaExternaContaSvc.ConciliacionEntreUnidadesEmisorRowData =
              data.length > 0 ? data[0] : null;

            this.loadingConciliacionEntreUnidadesEmisor = false;
          },
          error: err => {
            this._swalSvc.error(err.message || err);
          },
        });
    } catch (err: any) {
      this.loadingConciliacionEntreUnidadesEmisor = false;
      this._swalSvc.error(err.message || err);
    }
  }

  private _conciliacionEntreUnidadesReceptor() {
    try {
      this.loadingConciliacionEntreUnidadesReceptor = true;

      this._conciliaExternaContaSvc
        .conciliacionEntreUnidadesReceptor()
        .subscribe({
          next: response => {
            this.loadingConciliacionEntreUnidadesReceptor = false;

            const result = response.getConciliacionEntreUnidades;
            if (!result.success) {
              return this._swalSvc.error(result.error);
            }

            const data = result.data;
            this._conciliaExternaContaSvc.ConciliacionEntreUnidadesReceptorRowData =
              data.length > 0 ? data[0] : null;

            this.loadingConciliacionEntreUnidadesReceptor = false;
          },
          error: err => {
            this._swalSvc.error(err.message || err);
          },
        });
    } catch (err: any) {
      this.loadingConciliacionEntreUnidadesReceptor = false;
      this._swalSvc.error(err.message || err);
    }
  }

  async generatePDF() {
    const documentDefinition =
      await this._conciliaExternaContaSvc.getPdfDefinition(
        this.reporteName,
        this.selectedTab
      );
    this._pdfMakeSvc.generatePdf(documentDefinition);
  }

  closeReporte() {
    this.showReport = false;
  }

  exportar() {
    let data = [];
    switch (this.selectedTab) {
      case 0:
        data = this._conciliaExternaContaSvc.ConciliaContabRowData;
        break;
      case 1:
        data = this._conciliaExternaContaSvc.ActaConciliacionEmisorRowData.data;
        break;
      case 2:
        data =
          this._conciliaExternaContaSvc.ActaConciliacionReceptorRowData.data;
        break;
    }

    this._excelService.exportAsExcelFile(data, this.reporteName);
  }

  // updateActaConciliacionUsuariosList() {
  //   switch (this.selectedActaConcTab) {
  //     case 0:
  //       this._conciliaExternaContaSvc.ActaConciliacionUsuariosEmisorList =
  //         this._conciliaExternaContaSvc.Usuarios.filter(
  //           f =>
  //             f.Division.toString() ===
  //             this.fg.controls['division'].value.toString()
  //         ).map(u => {
  //           return {
  //             value: u.IdUsuario,
  //             label: u.NombreApellidos,
  //           };
  //         });
  //       this._conciliaExternaContaSvc.ActaConciliacionUsuariosReceptorList =
  //         this._conciliaExternaContaSvc.Usuarios.filter(
  //           f =>
  //             f.Division.toString() ===
  //             this.fg.controls['divisionOD'].value.toString()
  //         ).map(u => {
  //           return {
  //             value: u.IdUsuario,
  //             label: u.NombreApellidos,
  //           };
  //         });
  //       break;
  //     case 1:
  //       this._conciliaExternaContaSvc.ActaConciliacionUsuariosEmisorList =
  //         this._conciliaExternaContaSvc.Usuarios.filter(
  //           f =>
  //             f.Division.toString() ===
  //             this.fg.controls['divisionOD'].value.toString()
  //         ).map(u => {
  //           return {
  //             value: u.IdUsuario,
  //             label: u.NombreApellidos,
  //           };
  //         });
  //       this._conciliaExternaContaSvc.ActaConciliacionUsuariosReceptorList =
  //         this._conciliaExternaContaSvc.Usuarios.filter(
  //           f =>
  //             f.Division.toString() ===
  //             this.fg.controls['division'].value.toString()
  //         ).map(u => {
  //           return {
  //             value: u.IdUsuario,
  //             label: u.NombreApellidos,
  //           };
  //         });
  //       break;
  //   }

  //   this._conciliaExternaContaSvc.ActaConciliacionUsuariosSupervisorList =
  //     this._conciliaExternaContaSvc.Usuarios.filter(
  //       f => f.Division.toString() === '100'
  //     ).map(u => {
  //       return {
  //         value: u.IdUsuario,
  //         label: u.NombreApellidos,
  //       };
  //     });
  // }

  private _salvaConciliaContabilidad() {
    const diferencia =
      this._conciliaExternaContaSvc.ConciliaContabRowData.filter(
        (f: { Recibido: boolean }) => f.Recibido === true
      )
        .map((c: { DiferenciaImporte: number }) => c.DiferenciaImporte)
        .reduce((acc: number, value: number) => acc + value, 0);

    if (round(diferencia, 2) !== 0) {
      return this._swalSvc
        .error(`Los documentos marcados como Recibidos deben coincidir en Importe.
          <br>Es decir, se debe seleccionar un positivo y un negativo con el mismo monto.`);
    }

    this.saving = true;

    this._conciliaExternaContaSvc.salvaConciliaContabilidad().subscribe({
      next: response => {
        const result = response.updateConciliaContab;
        if (!result.success) {
          return this._swalSvc.error(result.error);
        }
        this.saving = false;
      },
      error: err => {
        this._swalSvc.error(err.message || err);
      },
    });
  }

  // getEmisor() {
  //   if (this.selectedActaConcTab === 0) {
  //     return this.unidades
  //       .filter(u => u.IdUnidad.toString() === this.fg.controls['unidad'].value)
  //       .map(u => u.Unidad);
  //   } else {
  //     return this.unidades
  //       .filter(
  //         u => u.IdUnidad.toString() === this.fg.controls['unidadOD'].value
  //       )
  //       .map(u => u.Unidad);
  //   }
  // }

  // getReceptor() {
  //   if (this.selectedActaConcTab === 0) {
  //     return this.unidades
  //       .filter(
  //         u => u.IdUnidad.toString() === this.fg.controls['unidadOD'].value
  //       )
  //       .map(u => u.Unidad);
  //   } else {
  //     return this.unidades
  //       .filter(u => u.IdUnidad.toString() === this.fg.controls['unidad'].value)
  //       .map(u => u.Unidad);
  //   }
  // }

  switchChatToggle(value: boolean) {
    this.chatToggle = value;
  }
}
