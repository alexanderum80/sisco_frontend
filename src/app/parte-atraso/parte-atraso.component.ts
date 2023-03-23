import { SweetalertService } from './../shared/helpers/sweetalert.service';
import { SelectItem } from 'primeng/api';
import { DivisionesService } from './../shared/services/divisiones.service';
import { FormGroup } from '@angular/forms';
import { ParteAtrasoService } from './shared/services/parte-atraso.service';
import {
  Component,
  OnInit,
  OnDestroy,
  AfterContentChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { PdfmakeService } from './../shared/helpers/pdfmake.service';
import { ITableColumns } from '../shared/ui/prime-ng/table/table.model';

@Component({
  selector: 'app-parte-atraso',
  templateUrl: './parte-atraso.component.html',
  styleUrls: ['./parte-atraso.component.scss'],
})
export class ParteAtrasoComponent
  implements OnInit, OnDestroy, AfterContentChecked
{
  selectedTabViewIndex = 0;

  displayedColumnsParteAtraso: ITableColumns[] = [
    { header: 'Unidad', field: 'Unidad', type: 'string' },
    { header: 'Atraso Restaurador', field: 'AtrasoRest', type: 'string' },
    { header: 'Atraso DWH', field: 'AtrasoDWH', type: 'string' },
    { header: 'Atraso Distribuidor', field: 'AtrasoDist', type: 'string' },
    { header: 'Atraso Empresa', field: 'AtrasoEmp', type: 'string' },
  ];
  displayedColumnsDatosIdGam: ITableColumns[] = [
    { header: 'Año', field: 'Ano', type: 'string' },
    { header: 'Mes', field: 'Mes', type: 'string' },
    { header: 'Fecha', field: 'Fecha', type: 'date' },
    { header: 'Versión Golden', field: 'Version', type: 'string' },
    { header: 'Versión UtilNet', field: 'vUtilnet', type: 'string' },
    { header: 'Última Circular', field: 'UltimaCircular', type: 'string' },
    {
      header: 'Período Restaurado',
      field: 'PeriodoRestaurado',
      type: 'string',
    },
  ];

  dataSourceParteAtraso = [];
  dataSourceDatosIdGam = [];

  divisionesValues: SelectItem[] = [];
  loading = false;

  fg: FormGroup;

  constructor(
    private _divisionesSvc: DivisionesService,
    private _parteAtrasoSvc: ParteAtrasoService,
    private _pdfMakeSvc: PdfmakeService,
    private _swalSvc: SweetalertService,
    private _cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fg = this._parteAtrasoSvc.fg;
    this._subscribeToFgChanges();

    this._getDivisiones();
  }

  ngAfterContentChecked(): void {
    this._cd.detectChanges();
  }

  ngOnDestroy(): void {
    this._parteAtrasoSvc.dispose();
  }

  private _getDivisiones(): void {
    try {
      this._parteAtrasoSvc.subscription.push(
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

  private _subscribeToFgChanges(): void {
    this._parteAtrasoSvc.subscription.push(
      this.fg.valueChanges.subscribe(() => {
        this.dataSourceParteAtraso = [];
        this.dataSourceDatosIdGam = [];
      })
    );
  }

  get formValid(): boolean {
    return this.fg.valid;
  }

  calcular(): void {
    try {
      this.loading = true;

      this._parteAtrasoSvc.subscription.push(
        this._parteAtrasoSvc.calcular().subscribe(res => {
          this.loading = false;
          const { parteAtrasos: _parteAtrasos, datosIdGAM: _datosIdGAM } = res;

          if (!_parteAtrasos.success || !_datosIdGAM.success) {
            this._swalSvc.error(_parteAtrasos.error || _datosIdGAM.error);
          }

          this.dataSourceParteAtraso = JSON.parse(_parteAtrasos.data);
          this.dataSourceDatosIdGam = JSON.parse(_datosIdGAM.data);
        })
      );
    } catch (err: any) {
      this.loading = false;

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

  reporte(): void {
    switch (this.selectedTabViewIndex) {
      case 0:
        this._reporteParteAtraso();
        break;
      case 1:
        this._reporteDetalleParteAtraso();
        break;
    }
  }

  private async _reporteParteAtraso(): Promise<any> {
    try {
      const documentDefinitions = {
        pageSize: 'LETTER',
        // pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition('Parte de Atrasos DWH'),
          await this._getDivisionDefinition(),
          await this._parteAtrasoSvc.getParteAtrasosDefinition(
            this.dataSourceParteAtraso
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

  private async _reporteDetalleParteAtraso(): Promise<any> {
    try {
      const documentDefinitions = {
        pageSize: 'LETTER',
        // pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition(
            'Detalle de las Salvas Golden DWH'
          ),
          await this._getDivisionDefinition(),
          await this._parteAtrasoSvc.getDetalleParteAtrasoDefinition(
            this.dataSourceDatosIdGam
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

  private _getDivisionDefinition(): any {
    const definition = [];

    const divisionValue = this.divisionesValues.find(
      d => d.value === this.fg.controls['idDivision'].value
    )?.label;

    definition.push({
      text: 'División: ' + divisionValue,
      bold: true,
      margin: [0, 10, 0, 0],
    });

    return definition;
  }
}
