import { SupervisoresService } from './../shared/services/supervisores.service';
import { MaterialService } from './../../shared/services/material.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ModalService } from './../../shared/services/modal.service';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { SupervisoresFormComponent } from '../supervisores-form/supervisores-form.component';
import { MenuItem } from 'primeng/api';
import { ITableColumns } from '../../shared/ui/prime-ng/table/table.model';
import { cloneDeep } from '@apollo/client/utilities';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-supervisores',
  templateUrl: './list-supervisores.component.html',
  styleUrls: ['./list-supervisores.component.scss']
})
export class ListSupervisoresComponent implements OnInit, AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'Supervisor', field: 'Supervisor', type: 'string' },
    { header: 'Cargo', field: 'Cargo.Cargo', type: 'string' },
    { header: 'División', field: 'Division.Division', type: 'string' },
  ];

  menuItems: MenuItem[] = [
    { id: '0', label: 'Editar', icon: 'mdi mdi-pencil', disabled: false, command: (event) => {
      this.edit(event);
    }},
    { id: '1', label: 'Eliminar', icon: 'mdi mdi-delete-outline', disabled: false, command: (event) => {
      this.delete(event);
    }},
  ];

  supervisores: any;

  constructor(
    private _modalSvc: ModalService,
    private _usuarioSvc: UsuarioService,
    private _supervisorSvc: SupervisoresService,
    private _materialSvc: MaterialService
  ) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this._getSupervisores();
  }

  ngOnDestroy(): void {
    this.supervisores = [];
  }

  hasAdminPermission(): boolean {
    return this._usuarioSvc.hasAdminPermission();
  }

  private _getSupervisores(): void {
    try {
      this._supervisorSvc.subscription.push(this._supervisorSvc.loadAllSupervisores().subscribe(response => {
        const result = response.getAllSupervisores;

        if (result.success === false) {
          return Swal.fire({
            icon: 'error',
            title: 'ERROR',
            text: `Ocurrió el siguiente error: ${ result.error }`,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        this.supervisores = cloneDeep(result.data);
      }));
    } catch (err: any) {
      Swal.fire({
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
        this.edit(values.element.IdSupervisor);
        break;
      case '1':
        this.delete(values.element.IdSupervisor);
        break;
    }
  }

  add(): void {
    if (this.hasAdminPermission()) {
      const inputData = {
        idSupervisor: '',
        supervisor: '',
        cargo: '',
        division: this._usuarioSvc.usuario.IdDivision
      };
      this._supervisorSvc.fg.patchValue(inputData);
      this._modalSvc.openModal(SupervisoresFormComponent);
    }
  }

  edit(menu: any): void {
    if (this.hasAdminPermission()) {
      this._supervisorSvc.subscription.push(this._supervisorSvc.loadSupervisorById(menu.item.automationId.IdSupervisor).subscribe(response => {
        const result = response.getSupervisorById;

        if (!result.success) {
          return Swal.fire({
            icon: 'error',
            title: 'ERROR',
            text: `Se produjo el siguiente error: ${ result.error }`,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        const selectedUsuario = result.data;

        const inputData = {
          idSupervisor: selectedUsuario.IdSupervisor,
          supervisor: selectedUsuario.Supervisor,
          cargo: selectedUsuario.Cargo.IdCargo,
          division: selectedUsuario.Division.IdDivision,
        };

        this._supervisorSvc.fg.patchValue(inputData);
        this._modalSvc.openModal(SupervisoresFormComponent);
      }));
    }
  }

  delete(menu: any): void {
    if (this.hasAdminPermission()) {
      Swal.fire({
        icon: 'question',
        title: '¿Desea Eliminar el Supervisor seleccionado?',
        text: 'No se podrán deshacer los cambios.',
        showConfirmButton: true,
        confirmButtonText: 'Sí',
        showCancelButton: true,
        cancelButtonText: 'No'
      }).then(res => {
        if (res.value) {
          this._supervisorSvc.subscription.push(this._supervisorSvc.delete(menu.item.automationId.IdSupervisor).subscribe(response => {
            const result = response.deleteSupervisor;

            if (!result.success) {
              return Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: `Se produjo el siguiente error: ${ result.error }`,
                showConfirmButton: true,
                confirmButtonText: 'Aceptar'
              });
            }

            this._materialSvc.openSnackBar('El Supervisor se ha eliminado correctamente.');
          }));
        }
      });
    }
  }

}
