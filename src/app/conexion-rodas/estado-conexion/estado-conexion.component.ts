import { ITableColumns } from 'src/app/shared/ui/prime-ng/table/table.model';
import { DivisionesService } from './../../shared/services/divisiones.service';
import { ConexionRodasService } from '../shared/services/conexion-rodas.service';
import { PdfmakeService } from '../../shared/services/pdfmake.service';
import { ConexionRodasQueryResponse } from '../shared/models/conexion-rodas.model';
import { toNumber } from 'lodash';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import SweetAlert from 'sweetalert2';
import { conexionRodasApi } from '../shared/graphql/conexion-rodasActions';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-estado-conexion',
  templateUrl: './estado-conexion.component.html',
  styleUrls: ['./estado-conexion.component.scss']
})
export class EstadoConexionRodasComponent implements OnInit {
  columns: ITableColumns[] = [
    { header: 'Unidad', field: 'Unidad', type: 'string' },
    { header: 'Estado', field: 'Estado', type: 'string' },
  ];
  dataSource = [];

  divisionesValues: SelectItem[] = [];
  loading = false;

  fg: FormGroup = new FormGroup({
    idDivision: new FormControl('', Validators.required)
  });

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo,
    private _divisionesSvc: DivisionesService,
    private _conexionRodasSvc: ConexionRodasService,
    private _pdfMakeSvc: PdfmakeService,
  ) { }

  ngOnInit(): void {
    this._getDivisiones();

    this._subscribeToFgChanges();
  }

  private _getDivisiones(): void {
    try {
      this.subscription.push(this._divisionesSvc.getDivisiones().subscribe(response => {
        const result = response.getAllDivisiones;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        this.divisionesValues = result.data.map((d: { IdDivision: string; Division: string; }) => {
          return {
            value: d.IdDivision,
            description: d.IdDivision + '-' + d.Division
          };
        });
      }));
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  private _subscribeToFgChanges(): void {
    this.subscription.push(this.fg.valueChanges.subscribe(() => {
      this.dataSource = [];
    }));
  }

  get formValid(): boolean {
    return this.fg.valid;
  }

  calcular(): void {
    try {
      this.loading = true;

      const idDivision = toNumber(this.fg.controls['idDivision'].value);

      this.subscription.push(this._apollo.query<ConexionRodasQueryResponse>({
        query: conexionRodasApi.estado,
        variables: { idDivision },
        fetchPolicy: 'network-only'
      }).subscribe(response => {
        this.loading = false;
        const result = response.data.estadoContaConexiones;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'Error',
            text: result.error,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        this.dataSource = result.data;
      }));
    } catch (err: any) {
      this.loading = false;

      SweetAlert.fire({
        icon: 'error',
        title: 'Error',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  isEstadoIncorrecto(row: { Estado: string; }): boolean {
    return row.Estado === 'Incorrecto';
  }

  async reporte(): Promise<any> {
    try {
      const documentDefinitions = {
        pageSize: 'LETTER',
        // pageOrientation: 'landscape',
        content: [
          await this._pdfMakeSvc.getHeaderDefinition('Estado de las Conexiones al Rodas.'),
          {
            margin: [0, 10, 0, 10],
            bold: true,
            columns: [
              { text: 'División: ' + this.divisionDescription }
            ]
          },
          await this._conexionRodasSvc.getEstadoConexionDefinition(this.dataSource),
        ],
        footer: (page: string, pages: string) => {
          return this._pdfMakeSvc.getFooterDefinition(page, pages);
        },
        defaultStyle: {
          fontSize: 9,
        },
        styles: {
          tableHeader: {
            bold: true
          }
        }
      };

      this._pdfMakeSvc.generatePdf(documentDefinitions);
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'Error',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  get divisionDescription(): string {
    return this.divisionesValues.find(f => f.value === this.fg.controls['idDivision'].value)?.label || '';
  }

}
