import { EmpleadosService } from './../shared/services/empleados.service';
import { EmpleadosFormComponent } from './../empleados-form/empleados-form.component';
import SweetAlert from 'sweetalert2';
import { MaterialService } from './../../shared/services/material.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ModalService } from './../../shared/services/modal.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ITableColumns } from 'src/app/shared/ui/prime-ng/table/table.model';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.scss']
})
export class ListEmpleadosComponent implements OnInit, AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'Empleado', field: 'Empleado', type: 'string' },
    { header: 'Cargo', field: 'Cargo.Cargo', type: 'string' },
    { header: 'División', field: 'Division.Division', type: 'string' },
  ];

  empleados: any[] = [];

  subscription: Subscription[] = [];

  menuItems: MenuItem[] = [
    { id: '0', label: 'Editar', icon: 'mdi mdi-pencil', disabled: false, command: (event) => {
      this.edit(event);
    }},
    { id: '1', label: 'Eliminar', icon: 'mdi mdi-delete-outline', disabled: false, command: (event) => {
      this.delete(event);
    }},
  ];

  constructor(
    private _modalSvc: ModalService,
    private _usuarioSvc: UsuarioService,
    private _empleadoSvc: EmpleadosService,
    private _materialSvc: MaterialService
  ) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this._getEmpleados();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
    this.empleados = [];
  }

  hasAdminPermission(): boolean {
    return this._usuarioSvc.hasAdminPermission();
  }

  private _getEmpleados(): void {
    try {
      this.subscription.push(this._empleadoSvc.loadAllEmpleados().subscribe(response => {
        const result = response.getAllEmpleados;

        if (result.success === false) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: `Ocurrió el siguiente error: ${ result.error }`,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        this.empleados = result.data;
      }));
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: `Ha ocurrido el siguiente error: ${ err }`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  onClicked(values: any): void {
    switch (values.action) {
      case '0':
        this.edit(values.element.IdEmpleado);
        break;
      case '1':
        this.delete(values.element.IdEmpleado);
        break;
    }
  }

  add(): void {
    if (this.hasAdminPermission()) {
      const inputData = {
        idEmpleado: '',
        empleado: '',
        cargo: '',
        division: this._usuarioSvc.usuario.IdDivision
      };
      this._empleadoSvc.fg.patchValue(inputData);
      this._modalSvc.openModal(EmpleadosFormComponent);
    }
  }

  edit(menu: any): void {
    if (this.hasAdminPermission()) {
      this.subscription.push(this._empleadoSvc.loadEmpleadoById(menu.item.automationId.IdEmpleado).subscribe(response => {
        const result = response.getEmpleadoById;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: `Se produjo el siguiente error: ${ result.error }`,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
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
        this._modalSvc.openModal(EmpleadosFormComponent);
      }));
    }
  }

  delete(menu: any): void {
    if (this.hasAdminPermission()) {
      SweetAlert.fire({
        icon: 'question',
        title: '¿Desea Eliminar el Empleado seleccionado?',
        text: 'No se podrán deshacer los cambios.',
        showConfirmButton: true,
        confirmButtonText: 'Sí',
        showCancelButton: true,
        cancelButtonText: 'No'
      }).then(res => {
        if (res.value) {
          this._empleadoSvc.delete(menu.item.automationId.IdEmpleado).subscribe(response => {
            const result = response.deleteEmpleado;

            if (!result.success) {
              return SweetAlert.fire({
                icon: 'error',
                title: 'ERROR',
                text: `Se produjo el siguiente error: ${ result.error }`,
                showConfirmButton: true,
                confirmButtonText: 'Aceptar'
              });
            }

            this._materialSvc.openSnackBar('El Empleado se ha eliminado correctamente.');
          });
        }
      });
    }
  }

}
