import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from './../../shared/services/authentication.service';
import { DefaultTopLeftButtonsTable } from './../../shared/models/table-buttons';
import { DefaultInlineButtonsTable } from '../../shared/models/table-buttons';
import { IButtons } from './../../shared/ui/prime-ng/button/button.model';
import {
  IActionItemClickedArgs,
  ActionClicked,
} from './../../shared/models/list-items';
import { SupervisoresService } from './../shared/services/supervisores.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { SupervisoresFormComponent } from '../supervisores-form/supervisores-form.component';
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

  inlineButtons: IButtons[] = [];
  topLeftButtons: IButtons[] = [];

  loading = true;

  constructor(
    private _authSvc: AuthenticationService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _supervisorSvc: SupervisoresService,
    private _toastrSvc: ToastrService
  ) {
    if (this.hasAdminPermission()) {
      this.inlineButtons = DefaultInlineButtonsTable;
      this.topLeftButtons = DefaultTopLeftButtonsTable;
    }
  }

  ngAfterViewInit(): void {
    this._getSupervisores();
  }

  ngOnDestroy(): void {
    this.supervisores = [];

    this._supervisorSvc.dispose();
  }

  hasAdminPermission(): boolean {
    return this._authSvc.hasAdminPermission();
  }

  private _getSupervisores(): void {
    try {
      this._supervisorSvc.subscription.push(
        this._supervisorSvc.loadAllSupervisores().subscribe(res => {
          this.loading = false;

          const result = res.getAllSupervisores;

          if (result.success === false) {
            return Swal.fire({
              icon: 'error',
              title: 'ERROR',
              text: result.error,
              showConfirmButton: true,
              confirmButtonText: 'Aceptar',
            });
          }

          this.supervisores = cloneDeep(result.data);
        })
      );
    } catch (err: any) {
      this.loading = false;

      Swal.fire({
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
        idSupervisor: '',
        supervisor: '',
        cargo: null,
        division: this._authSvc.usuario.IdDivision,
      };
      this._supervisorSvc.fg.patchValue(inputData);

      this._dinamicDialogSvc.open(
        'Agregar Supervisor',
        SupervisoresFormComponent
      );
      this._supervisorSvc.subscription.push(
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
      this._supervisorSvc.subscription.push(
        this._supervisorSvc
          .loadSupervisorById(data.IdSupervisor)
          .subscribe(res => {
            const result = res.getSupervisorById;

            if (!result.success) {
              return Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: result.error,
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
                    this._toastrSvc.success(message, 'Satisfactorio');
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
            this._supervisorSvc.delete(IDsToRemove).subscribe(res => {
              const result = res.deleteSupervisor;

              if (!result.success) {
                return Swal.fire({
                  icon: 'error',
                  title: 'ERROR',
                  text: result.error,
                  showConfirmButton: true,
                  confirmButtonText: 'Aceptar',
                });
              }

              this._toastrSvc.success(
                'El Supervisor se ha eliminado correctamente.',
                'Satisfactorio'
              );
            })
          );
        }
      });
    }
  }
}
