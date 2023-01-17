import { ActionClicked } from './../../shared/models/list-items';
import { ClasificadorCuentaService } from './../shared/service/clasificador-cuenta.service';
import { DinamicDialogService } from '../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { SweetalertService } from '../../shared/services/sweetalert.service';
import { UnidadesService } from '../../unidades/shared/services/unidades.service';
import { SelectItem } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-arregla-clasificador-form',
  templateUrl: './arregla-clasificador-form.component.html',
  styleUrls: ['./arregla-clasificador-form.component.scss'],
})
export class ArreglaClasificadorFormComponent implements OnInit, OnDestroy {
  fg: FormGroup;

  centrosValues: SelectItem[] = [];
  tipoCentrosValues: SelectItem[] = [
    { value: '0', label: 'Centro' },
    { value: '1', label: 'Complejo' },
    { value: '2', label: 'Consolidado' },
  ];

  loading = false;

  constructor(
    private _clasificadorCuentasSvc: ClasificadorCuentaService,
    private _unidadesSvc: UnidadesService,
    private _swalSvc: SweetalertService,
    private _dinamicDialogSvc: DinamicDialogService
  ) {}

  ngOnInit(): void {
    this.fg = this._clasificadorCuentasSvc.fgArreglaClasif;
    this.fg.reset();

    this._getUnidades();
  }

  ngOnDestroy(): void {
    this._clasificadorCuentasSvc.dispose();
  }

  private _getUnidades(): void {
    try {
      this._clasificadorCuentasSvc.subscription.push(
        this._unidadesSvc.getAllUnidadesByUsuario().subscribe(response => {
          const result = response.getAllUnidadesByUsuario;

          if (!result.success) {
            this._swalSvc.error(result.error);
            return;
          }

          this.centrosValues = result.data.map(
            (u: { IdUnidad: string; Nombre: string }) => {
              return {
                value: u.IdUnidad,
                label: u.IdUnidad + '-' + u.Nombre,
              };
            }
          );
        })
      );
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  aplicar(): void {
    try {
      this._swalSvc
        .question(
          `Antes de continuar con el proceso de Actualización, debe hacer una salva de este Centro en el Rodas, ya que este proceso es irreversible. 
        \n\n¿Desea continuar con la Actualización del Clasificador?`
        )
        .then(res => {
          if (res === ActionClicked.Yes) {
            this.loading = true;
            this._clasificadorCuentasSvc.subscription.push(
              this._clasificadorCuentasSvc.arreglaClasificador().subscribe({
                next: () => {
                  this.loading = false;
                },
                error: err => {
                  this.loading = false;
                  this._swalSvc.error(err.message || err);
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

  cancelar(): void {
    this._dinamicDialogSvc.close();
  }
}
