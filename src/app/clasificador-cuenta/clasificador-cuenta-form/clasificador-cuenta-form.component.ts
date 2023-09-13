import { Subscription } from 'rxjs';
import { SweetalertService } from './../../shared/helpers/sweetalert.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { ActionClicked } from './../../shared/models/list-items';
import { TipoEntidadesService } from './../../tipo-entidades/shared/services/tipo-entidades.service';
import SweetAlert from 'sweetalert2';
import { ClasificadorCuentaService } from './../shared/service/clasificador-cuenta.service';
import { FormGroup } from '@angular/forms';
import {
  Component,
  OnInit,
  OnDestroy,
  AfterContentChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-clasificador-cuenta-form',
  templateUrl: './clasificador-cuenta-form.component.html',
  styleUrls: ['./clasificador-cuenta-form.component.scss'],
})
export class ClasificadorCuentaFormComponent
  implements OnInit, OnDestroy, AfterContentChecked
{
  action: ActionClicked;
  fg: FormGroup;

  naturalezaValues: SelectItem[] = [
    { value: 'D', label: 'Deudora' },
    { value: 'A', label: 'Acreedora' },
    { value: 'M', label: 'Mixta' },
  ];

  tipoClasificadorValues: SelectItem[] = [
    { value: 1, label: 'Consolidado' },
    { value: 2, label: 'Centro' },
    { value: 3, label: 'Complejo' },
  ];

  tipoCuentaValues: SelectItem[] = [
    { value: 'I', label: 'Ingresos' },
    { value: 'G', label: 'Gastos' },
    { value: 'C', label: 'Costos' },
    { value: 'R', label: 'Resultados' },
    { value: 'V', label: 'Valoración' },
    { value: 'N', label: 'Otros' },
  ];

  clasificacionCuentaValues: SelectItem[] = [
    { value: 'R', label: 'Real' },
    { value: 'N', label: 'Nominal' },
    { value: 'O', label: 'Orden o Memorandum' },
    { value: 'V', label: 'Valuación' },
  ];

  estadoValues: SelectItem[] = [
    { value: 'A', label: 'Abierta' },
    { value: 'C', label: 'Cerrada' },
  ];

  tipoUnidadesValues: SelectItem[] = [];
  grupoCuentaValues: SelectItem[] = [];
  claseCuentaValues: SelectItem[] = [];
  categoriaCuentaValues: SelectItem[] = [];

  subscription: Subscription[] = [];

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _tipoEntidadesSvc: TipoEntidadesService,
    private _clasificadorSvc: ClasificadorCuentaService,
    private _swalSvc: SweetalertService,
    private _cd: ChangeDetectorRef
  ) {
    this._subscribeToObservables();
  }

  ngOnInit(): void {
    this.fg = this._clasificadorSvc.fg;

    this.action =
      this.fg.controls['cuenta'].value === ''
        ? ActionClicked.Add
        : ActionClicked.Edit;

    this._loadTipoUnidades();
    this._loadGrupoCuenta();
    this._loadClaseCuenta().then(() => this._loadCategoriaCuenta());

    this._subscribeToFgChanges();
  }

  ngAfterContentChecked(): void {
    this._cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  private _subscribeToObservables(): void {
    // grupo de cuentas
    this.subscription.push(
      this._clasificadorSvc.grupoCuentas$.subscribe(res => {
        this.grupoCuentaValues = res.map(g => {
          return {
            value: g.IdGrupo,
            label: g.Grupo,
          };
        });
      })
    );

    // clase de cuentas
    this.subscription.push(
      this._clasificadorSvc.claseCuentas$.subscribe(res => {
        this.claseCuentaValues = res.map(g => {
          return {
            value: g.IdClase,
            label: g.Clase,
          };
        });
      })
    );

    // categoria de cuentas
    this.subscription.push(
      this._clasificadorSvc.categoriaCuentas$.subscribe(res => {
        this.categoriaCuentaValues = res.map(g => {
          return {
            value: g.IdCategoria,
            label: g.Categoria,
          };
        });
      })
    );
  }

  private _loadTipoUnidades(): void {
    try {
      this.subscription.push(
        this._tipoEntidadesSvc.loadAllTipoEntidades().subscribe(res => {
          const result = res.getAllTipoEntidades;
          if (!result.success) {
            return SweetAlert.fire({
              icon: 'error',
              title: 'ERROR',
              text: result.error,
              confirmButtonText: 'Aceptar',
            });
          }

          this.tipoUnidadesValues = result.data.map(
            (tipo: { Id: any; Entidades: any }) => {
              return {
                value: tipo.Id,
                label: tipo.Entidades,
              };
            }
          );
        })
      );
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  private _loadGrupoCuenta(): void {
    try {
      this.subscription.push(
        this._clasificadorSvc.loadGrupoCuenta().subscribe({
          error: err => {
            this._swalSvc.error(err);
          },
        })
      );
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  private async _loadClaseCuenta(): Promise<void> {
    try {
      if (!this.fg.controls['grupo'].value) return;

      return new Promise<void>(resolve => {
        this.subscription.push(
          this._clasificadorSvc
            .loadClaseCuenta(this.fg.controls['grupo'].value)
            .subscribe({
              next: () => {
                resolve();
              },
              error: err => {
                this._swalSvc.error(err);
              },
            })
        );
      });
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  private _loadCategoriaCuenta(): void {
    try {
      if (!this.fg.controls['clase'].value) return;

      const idClase = this._clasificadorSvc.claseCuentas$.value.find(
        f =>
          f.IdClase === this.fg.controls['clase'].value &&
          f.IdGrupo === this.fg.controls['grupo'].value
      )?.ID;

      if (!idClase) return;

      this.subscription.push(
        this._clasificadorSvc.loadCategoriaCuenta(idClase).subscribe({
          error: err => {
            this._swalSvc.error(err);
          },
        })
      );
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  private _subscribeToFgChanges(): void {
    this.subscription.push(
      this.fg.controls['grupo'].valueChanges.subscribe(() => {
        this.fg.controls['clase'].setValue(null);
        this._loadClaseCuenta();
      })
    );
    this.subscription.push(
      this.fg.controls['clase'].valueChanges.subscribe(() => {
        this.fg.controls['categoria'].setValue(null);
        this._loadCategoriaCuenta();
      })
    );
  }

  onActionClicked(action: ActionClicked) {
    switch (action) {
      case ActionClicked.Save:
        this._save();
        break;
      case ActionClicked.Cancel:
        this._closeModal();
        break;
    }
  }

  private _save(): void {
    try {
      this.subscription.push(
        this._clasificadorSvc.save().subscribe(res => {
          const result = res.saveClasificadorCuenta;
          if (!result.success) {
            return SweetAlert.fire({
              icon: 'error',
              title: 'ERROR',
              text: result.error,
              showConfirmButton: true,
              confirmButtonText: 'Aceptar',
            });
          }

          let txtMessage;

          if (this.action === ActionClicked.Add) {
            txtMessage = 'La Cuenta se ha creado correctamente.';
          } else {
            txtMessage = 'La Cuenta se ha actualizado correctamente.';
          }

          this._closeModal(txtMessage);
        })
      );
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }
}
