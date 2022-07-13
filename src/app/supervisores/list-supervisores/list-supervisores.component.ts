import {
  IActionItemClickedArgs,
  ActionClicked,
} from './../../shared/models/list-items';
import { SupervisoresService } from './../shared/services/supervisores.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { SupervisoresFormComponent } from '../supervisores-form/supervisores-form.component';
import { MessageService } from 'primeng/api';
import { ITableColumns } from '../../shared/ui/prime-ng/table/table.model';
import { cloneDeep } from '@apollo/client/utilities';
import Swal from 'sweetalert2';
import { isArray } from 'lodash';

@Component({
  selector: 'app-list-supervisores',
  templateUrl: './list-supervisores.component.html',
  styleUrls: ['./list-supervisores.component.scss'],
})
export class ListSupervisoresComponent implements AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'Supervisor', field: 'Supervisor', type: 'string' },
    { header: 'Cargo', field: 'Cargo.Cargo', type: 'string' },
    { header: 'División', field: 'Division.Division', type: 'string' },
  ];

  supervisores: any;

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _usuarioSvc: UsuarioService,
    private _supervisorSvc: SupervisoresService,
    private _msgSvc: MessageService
  ) {}

  ngAfterViewInit(): void {
    this._getSupervisores();
  }

  ngOnDestroy(): void {
    this.supervisores = [];

    this._supervisorSvc.dispose();
  }

  hasAdminPermission(): boolean {
    return this._usuarioSvc.hasAdminPermission();
  }

  private _getSupervisores(): void {
    try {
      this._supervisorSvc.subscription.push(
        this._supervisorSvc.loadAllSupervisores().subscribe(response => {
          const result = response.getAllSupervisores;

          if (result.success === false) {
            return Swal.fire({
              icon: 'error',
              title: 'ERROR',
              text: `Ocurrió el siguiente error: ${result.error}`,
              showConfirmButton: true,
              confirmButtonText: 'Aceptar',
            });
          }

          this.supervisores = cloneDeep(result.data);
        })
      );
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'ERROR',
        text: `Ha ocurrido el siguiente error: ${err}`,
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
        idSupervisor: '',
        supervisor: '',
        cargo: null,
        division: this._usuarioSvc.usuario.IdDivision,
      };
      this._supervisorSvc.fg.patchValue(inputData);

      this._dinamicDialogSvc.open(
        'Agregar Supervisor',
        SupervisoresFormComponent
      );
      this._supervisorSvc.subscription.push(
        this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
          if (message) {
            this._msgSvc.add({
              severity: 'success',
              summary: 'Satisfactorio',
              detail: message,
            });
          }
        })
      );
    }
  }

  private _edit(data: any): void {
    if (this.hasAdminPermission()) {
      this._supervisorSvc.subscription.push(
        this._supervisorSvc
          .loadSupervisorById(data.IdSupervisor)
          .subscribe(response => {
            const result = response.getSupervisorById;

            if (!result.success) {
              return Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: `Se produjo el siguiente error: ${result.error}`,
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
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

            this._dinamicDialogSvc.open(
              'Modificar Supervisor',
              SupervisoresFormComponent
            );

            this._supervisorSvc.subscription.push(
              this._dinamicDialogSvc.ref.onClose.subscribe(
                (message: string) => {
                  if (message) {
                    this._msgSvc.add({
                      severity: 'success',
                      summary: 'Satisfactorio',
                      detail: message,
                    });
                  }
                }
              )
            );
          })
      );
    }
  }

  private _delete(data: any): void {
    if (this.hasAdminPermission()) {
      Swal.fire({
        icon: 'question',
        title: '¿Desea Eliminar el(los) Supervisor(es) seleccionado(s)?',
        text: 'No se podrán deshacer los cambios.',
        showConfirmButton: true,
        confirmButtonText: 'Sí',
        showCancelButton: true,
        cancelButtonText: 'No',
      }).then(res => {
        if (res.value) {
          const IDsToRemove: number[] = !isArray(data)
            ? [data.IdSupervisor]
            : data.map(d => {
                return d.IdSupervisor;
              });

          this._supervisorSvc.subscription.push(
            this._supervisorSvc.delete(IDsToRemove).subscribe(response => {
              const result = response.deleteSupervisor;

              if (!result.success) {
                return Swal.fire({
                  icon: 'error',
                  title: 'ERROR',
                  text: `Se produjo el siguiente error: ${result.error}`,
                  showConfirmButton: true,
                  confirmButtonText: 'Aceptar',
                });
              }

              this._msgSvc.add({
                severity: 'success',
                summary: 'Satisfactorio',
                detail: 'El Supervisor se ha eliminado correctamente.',
              });
            })
          );
        }
      });
    }
  }
}
