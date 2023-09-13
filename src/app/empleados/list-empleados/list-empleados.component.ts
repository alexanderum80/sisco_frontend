import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from './../../shared/services/authentication.service';
import { DefaultTopLeftButtonsTable } from './../../shared/models/table-buttons';
import { DefaultInlineButtonsTable } from '../../shared/models/table-buttons';
import { IButtons } from './../../shared/ui/prime-ng/button/button.model';
import {
  IActionItemClickedArgs,
  ActionClicked,
} from './../../shared/models/list-items';
import { EmpleadosService } from './../shared/services/empleados.service';
import { EmpleadosFormComponent } from './../empleados-form/empleados-form.component';
import SweetAlert from 'sweetalert2';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { ITableColumns } from 'src/app/shared/ui/prime-ng/table/table.model';
import { isArray } from 'lodash';

@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.scss'],
})
export class ListEmpleadosComponent implements AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'Empleado', field: 'Empleado', type: 'string' },
    { header: 'Cargo', field: 'Cargo.Cargo', type: 'string' },
    { header: 'División', field: 'Division.Division', type: 'string' },
  ];

  empleados: any[] = [];

  inlineButtons: IButtons[] = [];
  topLeftButtons: IButtons[] = [];

  loading = true;

  constructor(
    private _authSvc: AuthenticationService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _empleadoSvc: EmpleadosService,
    private _toastrSvc: ToastrService
  ) {
    if (this.hasAdminPermission()) {
      this.inlineButtons = DefaultInlineButtonsTable;
      this.topLeftButtons = DefaultTopLeftButtonsTable;
    }
  }

  ngAfterViewInit(): void {
    this._getEmpleados();
  }

  ngOnDestroy(): void {
    this.empleados = [];
    this._empleadoSvc.dispose();
  }

  hasAdminPermission(): boolean {
    return this._authSvc.hasAdminPermission();
  }

  private _getEmpleados(): void {
    try {
      this._empleadoSvc.subscription.push(
        this._empleadoSvc.loadAllEmpleados().subscribe(res => {
          this.loading = false;

          const result = res.getAllEmpleados;

          if (result.success === false) {
            return SweetAlert.fire({
              icon: 'error',
              title: 'ERROR',
              text: result.error,
              showConfirmButton: true,
              confirmButtonText: 'Aceptar',
            });
          }

          this.empleados = [...result.data];
        })
      );
    } catch (err: any) {
      this.loading = false;

      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  actionClicked(event: IActionItemClickedArgs) {
    switch (event.action) {
      case ActionClicked.Add:
        this._add();
        break;
      case ActionClicked.Edit:
        this._edit(event.item);
        break;
      case ActionClicked.Delete:
        this._delete(event.item);
        break;
    }
  }

  private _add(): void {
    if (this.hasAdminPermission()) {
      const inputData = {
        idEmpleado: '',
        empleado: '',
        cargo: null,
        division: this._authSvc.usuario.IdDivision,
      };
      this._empleadoSvc.fg.patchValue(inputData);

      this._dinamicDialogSvc.open('Agregar Empleado', EmpleadosFormComponent);
      this._empleadoSvc.subscription.push(
        this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
          if (message) {
            this._toastrSvc.success(message, 'Satisfactorio');
          }
        })
      );
    }
  }

  private _edit(data: any): void {
    if (this.hasAdminPermission()) {
      this._empleadoSvc.subscription.push(
        this._empleadoSvc.loadEmpleadoById(data.IdEmpleado).subscribe(res => {
          const result = res.getEmpleadoById;

          if (!result.success) {
            return SweetAlert.fire({
              icon: 'error',
              title: 'ERROR',
              text: result.error,
              showConfirmButton: true,
              confirmButtonText: 'Aceptar',
            });
          }

          const data = result.data;

          const inputData = {
            idEmpleado: data.IdEmpleado,
            empleado: data.Empleado,
            cargo: data.Cargo.IdCargo,
            division: data.Division.IdDivision,
          };

          this._empleadoSvc.fg.patchValue(inputData);

          this._dinamicDialogSvc.open(
            'Modificar Empleado',
            EmpleadosFormComponent
          );
          this._empleadoSvc.subscription.push(
            this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
              if (message) {
                this._toastrSvc.success(message, 'Satisfactorio');
              }
            })
          );
        })
      );
    }
  }

  private _delete(data: any): void {
    if (this.hasAdminPermission()) {
      SweetAlert.fire({
        icon: 'question',
        title: '¿Desea Eliminar el(los) Empleado(s) seleccionado(s)?',
        text: 'No se podrán deshacer los cambios.',
        showConfirmButton: true,
        confirmButtonText: 'Sí',
        showCancelButton: true,
        cancelButtonText: 'No',
      }).then(res => {
        if (res.value) {
          const IDsToRemove: number[] = !isArray(data)
            ? [data.IdEmpleado]
            : data.map(d => {
                return d.IdEmpleado;
              });

          this._empleadoSvc.delete(IDsToRemove).subscribe(res => {
            const result = res.deleteEmpleado;

            if (!result.success) {
              return SweetAlert.fire({
                icon: 'error',
                title: 'ERROR',
                text: result.error,
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
              });
            }

            this._toastrSvc.success(
              'El Empleado se ha eliminado correctamente.',
              'Satisfactorio'
            );
          });
        }
      });
    }
  }
}
