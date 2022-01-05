import { IUsuarioInfo } from './../../shared/models/usuarios';
import { UsuarioFormComponent } from './../usuario-form/usuario-form.component';
import { Subscription } from 'rxjs';
import { UsuarioService } from '../../shared/services/usuario.service';
import { MaterialService } from '../../shared/services/material.service';
import { UsuariosMutationResponse } from '../shared/models/usuarios.model';
import SweetAlert from 'sweetalert2';
import { QueryRef, Apollo } from 'apollo-angular';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { usuariosApi } from '../shared/graphql/usuarioActions.gql';
import { ModalService } from '../../shared/services/modal.service';
import { UsuariosQueryResponse } from '../shared/models/usuarios.model';
import { ITableColumns } from 'src/app/shared/ui/prime-ng/table/table.model';
import { cloneDeep } from '@apollo/client/utilities';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-usuarios',
  templateUrl: './list-usuarios.component.html',
  styleUrls: ['./list-usuarios.component.scss']
})
export class ListUsuariosComponent implements OnInit, AfterViewInit, OnDestroy {
  listUsuarioQuery: QueryRef<UsuariosQueryResponse>;

  columns: ITableColumns[] = [
    { header: 'Usuario', field: 'Usuario', type: 'string' },
    { header: 'Tipo de Usuario', field: 'TipoUsuario.TipoUsuario', type: 'string' },
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

  usuarios: IUsuarioInfo[] = [];

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo,
    private _modalSvc: ModalService,
    private _usuarioSvc: UsuarioService,
    private _materialSvc: MaterialService
  ) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this._getUsuarios();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  hasAdminPermission(): boolean {
    return this._usuarioSvc.hasAdminPermission();
  }

  private _getUsuarios(): void {
    try {
      this.subscription.push(this._apollo.watchQuery<UsuariosQueryResponse>({
          query: usuariosApi.all,
          fetchPolicy: 'network-only'
        }).valueChanges.subscribe(({data}) => {
          const result = data.getAllUsuarios;

          if (result.success === false) {
            return SweetAlert.fire({
              icon: 'error',
              title: 'ERROR',
              text: `Ocurrió el siguiente error: ${ result.error }`,
              showConfirmButton: true,
              confirmButtonText: 'Aceptar'
            });
          }

          this.usuarios = cloneDeep(result.data);
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

  add(): void {
    if (this.hasAdminPermission()) {
      const inputData = {
        idUsuario: '',
        usuario: '',
        contrasena: '',
        tipoUsuario: '',
        cambiarContrasena: false,
        contrasenaAvanzada: '',
        idDivision: this._usuarioSvc.usuario.IdDivision
      };
      this._usuarioSvc.fg.patchValue(inputData);
      this._modalSvc.openModal(UsuarioFormComponent);
    }
  }

  edit(menu: any): void {
    if (this.hasAdminPermission()) {
      const idUsuario = menu.item.automationId.IdUsuario;

      this.subscription.push(this._apollo.query<UsuariosQueryResponse>({
        query: usuariosApi.byId,
        variables: { id: idUsuario },
        fetchPolicy: 'network-only'
      }).subscribe(response => {
        const result = response.data.getUsuarioById;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: `Se produjo el siguiente error: ${ result.error }`,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        const selectedUsuario = result.data;

        const inputData = {
          idUsuario: selectedUsuario.IdUsuario,
          usuario: selectedUsuario.Usuario,
          contrasena: '',
          tipoUsuario: selectedUsuario.TipoUsuario.IdTipo,
          contrasenaAvanzada: '',
          idDivision: selectedUsuario.Division.IdDivision,
        };

        this._usuarioSvc.fg.patchValue(inputData);
        this._modalSvc.openModal(UsuarioFormComponent);
      }));
    }
  }

  delete(menu: any): void {
    if (this.hasAdminPermission()) {
      SweetAlert.fire({
        icon: 'question',
        title: '¿Desea Eliminar el Usuario seleccionado?',
        text: 'No se podrán deshacer los cambios.',
        showConfirmButton: true,
        confirmButtonText: 'Sí',
        showCancelButton: true,
        cancelButtonText: 'No'
      }).then(res => {
        if (res.value) {
          const idUsuario = menu.item.automationId.IdUsuario;

          const docsToRemove = [idUsuario];

          this.subscription.push(this._apollo.mutate<UsuariosMutationResponse>({
            mutation: usuariosApi.delete,
            variables: { IDs: docsToRemove },
            refetchQueries: ['GetAllUsuarios']
          }).subscribe(response => {
            const result = response.data?.deleteUsuario;

            if (result?.success === false) {
              return SweetAlert.fire({
                icon: 'error',
                title: 'ERROR',
                text: `Ocurrió el siguiente error: ${ result?.error }`,
                showConfirmButton: true,
                confirmButtonText: 'Aceptar'
              });
            }

            this._materialSvc.openSnackBar('El Usuario se ha eliminado correctamente.');
          }));
        }
      });
    }
  }

}
