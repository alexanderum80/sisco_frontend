import { ActionClicked } from './../../shared/models/list-items';
import { cloneDeep } from '@apollo/client/utilities';
import { CuentasNoPermitidasService } from './../shared/services/cuentas-no-permitidas.service';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { MenuItem } from 'primeng/api';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CuentasNoPermitidasFormComponent } from '../cuentas-no-permitidas-form/cuentas-no-permitidas-form.component';

@Component({
  selector: 'app-list-cuentas-no-permitidas',
  templateUrl: './list-cuentas-no-permitidas.component.html',
  styleUrls: ['./list-cuentas-no-permitidas.component.scss']
})
export class ListCuentasNoPermitidasComponent implements OnInit, AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'Cuenta', field: 'Cta', type: 'string' },
    { header: 'SubCuenta', field: 'SubCta', type: 'string' },
    { header: 'Crit1', field: 'Crit1', type: 'string' },
    { header: 'Crit2', field: 'Crit2', type: 'string' },
    { header: 'Crit3', field: 'Crit3', type: 'string' },
  ];

  cuentasNoPermitidas: any[] = [];

  subscription: Subscription[] = [];

  menuItems: MenuItem[] = [
    { id: '0', label: 'Editar', icon: 'mdi mdi-pencil', disabled: false, command: (event) => {
      this.edit(event);
    }},
    { id: '1', label: 'Eliminar', icon: 'mdi mdi-delete-outline', disabled: false, command: (event) => {
      this.delete(event);
    }},
  ];

  loading = true;

  constructor(
    private _cuentasNoPermitidasSvc: CuentasNoPermitidasService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlertSvc: SweetalertService
  ) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this._getCuentasNoPermitidas();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
    this.cuentasNoPermitidas = [];
  }

  private _getCuentasNoPermitidas(): void {
    try {
      this.subscription.push(this._cuentasNoPermitidasSvc.loadAllCuentasNoPermitidas().subscribe(response => {
        this.loading = false;

        const result = response.getAllNoUsarEnCuenta;

        if (result.success === false) {
          return this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ result.error }`);
        }

        this.cuentasNoPermitidas = cloneDeep(result.data);
      }));
    } catch (err: any) {
      this.loading = false;
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ err }`);
    }
  }

  add(): void {
    try {
      this._cuentasNoPermitidasSvc.inicializarFg();
      this._dinamicDialogSvc.open('Agregar Cuenta no Permitida', CuentasNoPermitidasFormComponent);
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ err }`);
    }
  }

  edit(menu: any): void {
    try {
      this._cuentasNoPermitidasSvc.inicializarFg();
      this._cuentasNoPermitidasSvc.loadCuentaNoPermitida(menu.item.automationId.Id).subscribe(response => {
        const result = response.getNoUsarEnCuentaById;

        if (!result.success) {
          throw new Error(result.error);
        }

        const inputValue = {
          id: result.data.Id,
          codigo:  result.data.Codigo,
          cta: result.data.Cta,
          subCta: result.data.SubCta,
          crit1: result.data.Crit1,
          crit2: result.data.Crit2,
          crit3: result.data.Crit3,
        };

        this._cuentasNoPermitidasSvc.fg.patchValue(inputValue);

        this._dinamicDialogSvc.open('Editar Cuenta no Permitida',CuentasNoPermitidasFormComponent);
      });
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ err }`);
    }
  }

  delete(menu: any): void {
    try {
      this._sweetAlertSvc.question('¿Desea Eliminar la Cuenta no Permitida seleccionada?').then(res => {
        if (res === ActionClicked.Yes) {
          this._cuentasNoPermitidasSvc.deleteCuentaNoPermitida(menu.item.automationId.Id).subscribe(response => {
            const result = response.deleteNoUsarEnCuenta;

            if (!result.success) {
              throw new Error(result.error);
            }
            this._sweetAlertSvc.success('La Cuenta no Permitida se ha eliminado Satisfactoriamente.');
          });
        }
      });
    } catch (err: any) {
      this._sweetAlertSvc.error(`Ocurrió el siguiente error: ${ err }`);
    }
  }


}
