import { PdfmakeService } from './../../../shared/services/pdfmake.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { SweetalertService } from './../../../shared/services/sweetalert.service';
import { DivisionesService } from './../../../shared/services/divisiones.service';
import { FormGroup } from '@angular/forms';
import { InformeCuentasCobrarPagarService } from './../../shared/services/informe-cuentas-cobrar-pagar.service';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterContentChecked,
  OnDestroy,
} from '@angular/core';
import { SelectItem } from 'primeng/api';
import * as moment from 'moment';

@Component({
  selector: 'app-informe-cuentas-cobrar-pagar-form',
  templateUrl: './informe-cuentas-cobrar-pagar-form.component.html',
  styleUrls: ['./informe-cuentas-cobrar-pagar-form.component.scss'],
})
export class InformeCuentasCobrarPagarFormComponent
  implements OnInit, AfterContentChecked, OnDestroy
{
  fg: FormGroup;

  divisionesValues: SelectItem[] = [];

  loading = false;

  constructor(
    private _informeCtasCobrarPagarSvc: InformeCuentasCobrarPagarService,
    private _divisionesSvc: DivisionesService,
    private _sweetAlertSvc: SweetalertService,
    private _dynamicDialogRef: DynamicDialogRef,
    private _cd: ChangeDetectorRef,
    private _pdfMakeSvc: PdfmakeService
  ) {}

  ngOnInit(): void {
    this.fg = this._informeCtasCobrarPagarSvc.fg;
    this.fg.reset();

    this._getDivisiones();
  }

  ngAfterContentChecked(): void {
    this._cd.detectChanges();
  }

  ngOnDestroy(): void {
    this._informeCtasCobrarPagarSvc.dispose();
  }

  private _getDivisiones(): void {
    try {
      this._informeCtasCobrarPagarSvc.subscription.push(
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

  reporte(): void {
    try {
      this.loading = true;

      this._informeCtasCobrarPagarSvc.subscription.push(
        this._informeCtasCobrarPagarSvc
          .getInformeCuentasCobrarPagar()
          .subscribe({
            next: res => {
              this.loading = false;

              this._informeCtasCobrarPagarSvc.informeCuentasCobrarPagar =
                res.contaInformeCtasCobrarPagar;
              this._reporteInforme();
            },
            error: err => {
              this.loading = false;
              this._sweetAlertSvc.error(err);
            },
          })
      );
    } catch (err) {
      this.loading = false;
      this._sweetAlertSvc.error(err);
    }
  }

  private async _reporteInforme(): Promise<any> {
    try {
      const documentDefinitions = {
        info: {
          title: 'Informe de Cuentas por Cobrar y Pagar | SISCO',
        },
        pageSize: 'LETTER',
        // pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition(
            'Informe de Cuentas por Cobrar y Pagar'
          ),
          await this._informeCtasCobrarPagarSvc.getDivision(),
          await this._pdfMakeSvc.getPeriodoDefinition(
            +moment(this.fg.controls['periodo'].value).format('MM'),
            moment(this.fg.controls['periodo'].value).format('YYYY')
          ),

          await this._informeCtasCobrarPagarSvc.getInformeCuentasCobrarPagarDefinition(),
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

  cancelar(): void {
    this._dynamicDialogRef.close();
  }
}
